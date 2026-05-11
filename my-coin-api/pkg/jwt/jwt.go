package jwt

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("token expired")
)

type Claims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

type JWTManager struct {
	secretKey     string
	accessTimeout time.Duration
	refreshTimeout time.Duration
}

func NewJWTManager(secretKey string, accessTimeout, refreshTimeout time.Duration) *JWTManager {
	return &JWTManager{
		secretKey:      secretKey,
		accessTimeout:  accessTimeout,
		refreshTimeout: refreshTimeout,
	}
}

func (m *JWTManager) GenerateAccessToken(userID uint) (string, error) {
	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(m.accessTimeout)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(m.secretKey))
}

func (m *JWTManager) GenerateRefreshToken() (string, error) {
	claims := jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(m.refreshTimeout)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(m.secretKey))
}

func (m *JWTManager) GenerateToken(userID uint) (string, string, error) {
	access, err := m.GenerateAccessToken(userID)
	if err != nil {
		return "", "", err
	}
	refresh, err := m.GenerateRefreshToken()
	if err != nil {
		return "", "", err
	}
	return access, refresh, nil
}

func (m *JWTManager) ValidateToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(m.secretKey), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}
