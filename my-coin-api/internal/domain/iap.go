package domain

import (
	"fmt"
	"time"

	"github.com/shopspring/decimal"
)

type SubscriptionStatus string

const (
	StatusActive   SubscriptionStatus = "active"
	StatusExpired  SubscriptionStatus = "expired"
	StatusCanceled SubscriptionStatus = "canceled"
	StatusGrace    SubscriptionStatus = "grace"
	StatusRevoked  SubscriptionStatus = "revoked"
)

func (s SubscriptionStatus) String() string {
	return string(s)
}

// MapAppleNotificationToStatus maps Apple's notificationType to internal SubscriptionStatus
func MapAppleNotificationToStatus(notificationType string) SubscriptionStatus {
	switch notificationType {
	case "REFUND", "REVOKE":
		return StatusRevoked
	case "EXPIRED", "DID_FAIL_TO_RENEW", "GRACE_PERIOD_EXPIRED":
		return StatusExpired
	case "GRACE_PERIOD":
		return StatusGrace
	case "SUBSCRIBED", "DID_RENEW", "RENEWAL_EXTENDED", "OFFER_REDEEMED":
		return StatusActive
	default:
		return StatusActive // Default to active for new/unknown types if they suggest a purchase
	}
}

type UserSubscription struct {
	ID                    uint       `gorm:"primaryKey" json:"id"`
	UserID                uint       `gorm:"not null;index" json:"user_id"`
	ProductID             string     `gorm:"type:text;not null" json:"product_id"`
	SubscriptionGroupID   string     `gorm:"type:text" json:"subscription_group_id"`
	Status                SubscriptionStatus `gorm:"type:text;not null" json:"status"` // active / expired / canceled / grace / revoked
	StartTime             *time.Time `json:"start_time"`
	EndTime               *time.Time      `json:"end_time"`
	Price                 decimal.Decimal `gorm:"type:decimal(10,2)" json:"price"`
	Currency              string          `gorm:"type:text" json:"currency"`
	IsTrialConsumed       bool       `gorm:"default:false" json:"is_trial_consumed"`
	OriginalTransactionID string     `gorm:"type:text;uniqueIndex" json:"original_transaction_id"`
	LatestTransactionID   string     `gorm:"type:text" json:"latest_transaction_id"`
	AutoRenewStatus       bool       `gorm:"default:true" json:"auto_renew_status"`
	Environment           string     `gorm:"type:text" json:"environment"` // sandbox / production
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
}

func (s *UserSubscription) IsActive() bool {
	if s.Status != StatusActive && s.Status != StatusGrace {
		return false
	}
	if s.EndTime != nil && time.Now().After(*s.EndTime) {
		return false
	}
	return true
}

func (s *UserSubscription) CacheKey() string {
	return fmt.Sprintf("user:subscription:%d", s.UserID)
}

func (UserSubscription) TableName() string {
	return "user_subscription"
}

type Product struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ProductID string    `gorm:"type:text;uniqueIndex;not null" json:"product_id"`
	Name      string    `gorm:"type:text" json:"name"`
	Plan      string    `gorm:"type:text" json:"plan"` // pro, plus, etc.
	Type      string    `gorm:"type:text" json:"type"` // auto_renewable, non_consumable
	IsActive  bool      `gorm:"default:true" json:"is_active"`
	SortOrder int       `json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Product) TableName() string {
	return "products"
}

type WebhookEvent struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	NotificationID string    `gorm:"type:text;uniqueIndex;not null" json:"notification_id"`
	Payload        []byte    `gorm:"type:jsonb" json:"payload"`
	CreatedAt      time.Time `json:"created_at"`
}

func (WebhookEvent) TableName() string {
	return "webhook_events"
}

type BillingLog struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint            `gorm:"not null;index" json:"user_id"`
	TransactionID string          `gorm:"type:text" json:"transaction_id"`
	ProductID     string          `gorm:"type:text" json:"product_id"`
	Price         decimal.Decimal `gorm:"type:decimal(10,2)" json:"price"`
	Currency      string          `gorm:"type:text" json:"currency"`
	RefundReason  string    `gorm:"type:text" json:"refund_reason"`
	EventType     string    `gorm:"type:text;not null" json:"event_type"`
	Payload       []byte    `gorm:"type:jsonb" json:"payload"`
	CreatedAt      time.Time `json:"created_at"`
}

func (BillingLog) TableName() string {
	return "billing_logs"
}
