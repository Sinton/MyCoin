package logger

import (
	"github.com/shopspring/decimal"
	"go.uber.org/zap"
)

// Business logs a structured event for analytics/metrics
func Business(event string, fields ...zap.Field) {
	Log.Info("BUSINESS_EVENT", append([]zap.Field{zap.String("event", event)}, fields...)...)
}

// Common event helpers
func LogSubscription(userID uint, productID string, status string, price decimal.Decimal, currency string) {
	Business("subscription_sync",
		zap.Uint("user_id", userID),
		zap.String("product_id", productID),
		zap.String("status", status),
		zap.String("price", price.String()),
		zap.String("currency", currency),
	)
}

func LogRefund(userID uint, productID string, reason string) {
	Business("refund_detected",
		zap.Uint("user_id", userID),
		zap.String("product_id", productID),
		zap.String("reason", reason),
	)
}
