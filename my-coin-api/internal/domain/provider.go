package domain

import (
	"context"
	"github.com/shopspring/decimal"
)

// TransactionInfo is a unified structure for transaction data across different providers
type TransactionInfo struct {
	TransactionID         string
	OriginalTransactionID string
	ProductID             string
	SubscriptionGroupID   string
	PurchaseDate          int64
	ExpiresDate           int64
	Price                 decimal.Decimal
	Currency              string
	Environment           string
	IsTrial               bool
}

// NotificationInfo is a unified structure for webhook notifications
type NotificationInfo struct {
	NotificationID   string
	NotificationType string
	Transaction      *TransactionInfo
	RawPayload       interface{}
}

// IAPProvider defines the standard interface for App Store providers (Apple, Google, etc.)
type IAPProvider interface {
	VerifyTransaction(ctx context.Context, transactionID string) (*TransactionInfo, error)
	GetSubscriptionHistory(ctx context.Context, originalTransactionID string) ([]*TransactionInfo, error)
	HandleNotification(ctx context.Context, payload string) (*NotificationInfo, error)
	GetProviderName() string
}
