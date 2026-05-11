package apple

import (
	"context"
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/Sinton/my-coin-api/internal/config"
	"github.com/Sinton/my-coin-api/internal/domain"
	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/shopspring/decimal"
)

const (
	ProductionBaseURL = "https://api.storekit.itunes.apple.com"
	SandboxBaseURL    = "https://api.storekit-sandbox.itunes.apple.com"
)

type Client struct {
	Config     *config.Config
	RootCAs    *x509.CertPool
	HTTPClient *http.Client
}

type TransactionResponse struct {
	SignedTransactionInfo string `json:"signedTransactionInfo"`
}

func NewClient(cfg *config.Config) (*Client, error) {
	// Load Apple Root CAs for JWS verification
	pool := x509.NewCertPool()
	certPath := filepath.Join("configs", "certs", "AppleRootCA-G3.cer")
	caCert, err := os.ReadFile(certPath)
	if err == nil {
		pool.AppendCertsFromPEM(caCert)
	}

	return &Client{
		Config:     cfg,
		RootCAs:    pool,
		HTTPClient: &http.Client{Timeout: 10 * time.Second},
	}, nil
}

func (c *Client) GenerateToken() (string, error) {
	// Load private key from file
	keyData, err := os.ReadFile(c.Config.Apple.PrivateKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key: %w", err)
	}

	block, _ := pem.Decode(keyData)
	if block == nil {
		return "", fmt.Errorf("failed to decode PEM block")
	}

	privateKey, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return "", fmt.Errorf("failed to parse private key: %w", err)
	}

	ecdsaKey, ok := privateKey.(*ecdsa.PrivateKey)
	if !ok {
		return "", fmt.Errorf("not an ecdsa private key")
	}

	// Create JWT for Apple App Store Server API
	token := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.MapClaims{
		"iss": c.Config.Apple.IssuerID,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(20 * time.Minute).Unix(),
		"aud": "appstoreconnect-v1",
		"bid": c.Config.Apple.BundleID,
	})

	token.Header["kid"] = c.Config.Apple.KeyID

	return token.SignedString(ecdsaKey)
}

type HistoryResponse struct {
	AppAppleId         int64    `json:"appAppleId"`
	BundleId           string   `json:"bundleId"`
	Environment        string   `json:"environment"`
	HasMore            bool     `json:"hasMore"`
	Revision           string   `json:"revision"`
	SignedTransactions []string `json:"signedTransactions"`
}

func (c *Client) GetTransactionInfo(ctx context.Context, transactionID string) (*TransactionResponse, error) {
	baseURL := ProductionBaseURL
	if c.Config.Apple.IsSandbox {
		baseURL = SandboxBaseURL
	}

	url := fmt.Sprintf("%s/inApps/v1/transactions/%s", baseURL, transactionID)

	token, err := c.GenerateToken()
	if err != nil {
		return nil, err
	}

	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("apple api error: status=%d body=%s", resp.StatusCode, string(body))
	}

	var txResp TransactionResponse
	if err := json.NewDecoder(resp.Body).Decode(&txResp); err != nil {
		return nil, err
	}

	return &txResp, nil
}

func (c *Client) GetTransactionHistory(ctx context.Context, originalTransactionID string, revision string) (*HistoryResponse, error) {
	baseURL := ProductionBaseURL
	if c.Config.Apple.IsSandbox {
		baseURL = SandboxBaseURL
	}

	url := fmt.Sprintf("%s/inApps/v1/history/%s", baseURL, originalTransactionID)
	if revision != "" {
		url = fmt.Sprintf("%s?revision=%s", url, revision)
	}

	token, err := c.GenerateToken()
	if err != nil {
		return nil, err
	}

	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("apple history api error: status=%d body=%s", resp.StatusCode, string(body))
	}

	var history HistoryResponse
	if err := json.NewDecoder(resp.Body).Decode(&history); err != nil {
		return nil, err
	}

	return &history, nil
}

func (c *Client) GetProviderName() string {
	return "apple"
}

func (c *Client) VerifyTransaction(ctx context.Context, transactionID string) (*domain.TransactionInfo, error) {
	resp, err := c.GetTransactionInfo(ctx, transactionID)
	if err != nil {
		return nil, err
	}

	claims, err := VerifyJWS(resp.SignedTransactionInfo, c.RootCAs, &TransactionClaims{})
	if err != nil {
		return nil, err
	}

	return c.mapToDomainInfo(claims), nil
}

func (c *Client) GetSubscriptionHistory(ctx context.Context, originalTransactionID string) ([]*domain.TransactionInfo, error) {
	history, err := c.GetTransactionHistory(ctx, originalTransactionID, "")
	if err != nil {
		return nil, err
	}

	results := make([]*domain.TransactionInfo, 0, len(history.SignedTransactions))
	for _, signedTx := range history.SignedTransactions {
		claims, err := VerifyJWS(signedTx, c.RootCAs, &TransactionClaims{})
		if err != nil {
			continue
		}
		results = append(results, c.mapToDomainInfo(claims))
	}

	return results, nil
}

func (c *Client) HandleNotification(ctx context.Context, payload string) (*domain.NotificationInfo, error) {
	claims, err := VerifyJWS(payload, c.RootCAs, &NotificationClaims{})
	if err != nil {
		return nil, err
	}

	txClaims, err := VerifyJWS(claims.Data.SignedTransactionInfo, c.RootCAs, &TransactionClaims{})
	if err != nil {
		return nil, err
	}

	return &domain.NotificationInfo{
		NotificationID:   claims.NotificationUUID,
		NotificationType: claims.NotificationType,
		Transaction:      c.mapToDomainInfo(txClaims),
		RawPayload:       claims,
	}, nil
}

func (c *Client) mapToDomainInfo(claims *TransactionClaims) *domain.TransactionInfo {
	return &domain.TransactionInfo{
		TransactionID:         claims.TransactionId,
		OriginalTransactionID: claims.OriginalTransactionId,
		ProductID:             claims.ProductId,
		SubscriptionGroupID:   claims.SubscriptionGroupIdentifier,
		PurchaseDate:          claims.PurchaseDate,
		ExpiresDate:           claims.ExpiresDate,
		Price:                 claims.Price.Div(decimal.NewFromInt(1000)),
		Currency:              claims.Currency,
		Environment:           claims.Environment,
		IsTrial:               claims.OfferType == 1,
	}
}

// AppleIDClaims represents the claims in an Apple ID identity token
type AppleIDClaims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

// VerifyIdentityToken verifies the Apple identity token and returns the Apple User ID (sub)
func (c *Client) VerifyIdentityToken(ctx context.Context, identityToken string) (string, error) {
	// 1. Initialize keyfunc with Apple's JWKS URL
	k, err := keyfunc.NewDefault([]string{"https://appleid.apple.com/auth/keys"})
	if err != nil {
		return "", fmt.Errorf("failed to create keyfunc: %w", err)
	}

	// 2. Parse and verify token
	token, err := jwt.ParseWithClaims(identityToken, &AppleIDClaims{}, k.Keyfunc)
	if err != nil {
		return "", fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(*AppleIDClaims)
	if !ok {
		return "", fmt.Errorf("invalid claims type")
	}

	// 3. Verify standard claims
	if claims.Issuer != "https://appleid.apple.com" {
		return "", fmt.Errorf("invalid issuer: %s", claims.Issuer)
	}
	if len(claims.Audience) == 0 || claims.Audience[0] != c.Config.Apple.BundleID {
		return "", fmt.Errorf("invalid audience: %s", claims.Audience[0])
	}

	return claims.Subject, nil
}
