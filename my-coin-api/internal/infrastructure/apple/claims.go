package apple

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/shopspring/decimal"
)

// TransactionClaims represents the decoded JWS transaction information from Apple
// Reference: https://developer.apple.com/documentation/appstoreserverapi/jwstransactiondecodedpayload
type TransactionClaims struct {
	jwt.RegisteredClaims
	TransactionId               string  `json:"transactionId"`
	OriginalTransactionId       string  `json:"originalTransactionId"`
	BundleId                    string  `json:"bundleId"`
	ProductId                   string  `json:"productId"`
	SubscriptionGroupIdentifier string  `json:"subscriptionGroupIdentifier"`
	PurchaseDate                int64   `json:"purchaseDate"`
	ExpiresDate                 int64   `json:"expiresDate"`
	Quantity                    int     `json:"quantity"`
	Type                        string  `json:"type"`
	InAppOwnershipType          string  `json:"inAppOwnershipType"`
	SignedDate                  int64   `json:"signedDate"`
	Environment                 string  `json:"environment"`
	TransactionReason           string  `json:"transactionReason"`
	Storefront                  string  `json:"storefront"`
	StorefrontId                string  `json:"storefrontId"`
	Price                       decimal.Decimal `json:"price"`
	Currency                    string  `json:"currency"`
	OfferType                   int     `json:"offerType"`
}

// NotificationClaims represents the decoded JWS notification payload from Apple
// Reference: https://developer.apple.com/documentation/appstoreserverapi/responsebodyv2decodedpayload
type NotificationClaims struct {
	jwt.RegisteredClaims
	NotificationType string           `json:"notificationType"`
	Subtype          string           `json:"subtype"`
	NotificationUUID string           `json:"notificationUUID"`
	Version          string           `json:"version"`
	SignedDate       int64            `json:"signedDate"`
	Data             NotificationData `json:"data"`
}

type NotificationData struct {
	AppAppleId            int64  `json:"appAppleId"`
	BundleId              string `json:"bundleId"`
	BundleVersion         string `json:"bundleVersion"`
	Environment           string `json:"environment"`
	SignedTransactionInfo string `json:"signedTransactionInfo"`
	SignedRenewalInfo     string `json:"signedRenewalInfo"`
	Status                int    `json:"status"`
}
