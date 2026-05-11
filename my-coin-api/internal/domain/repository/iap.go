package repository

import (
	"context"
	"time"

	"github.com/Sinton/my-coin-api/internal/domain"
)

type SubscriptionRepository interface {
	GetByOriginalTransactionID(ctx context.Context, id string) (*domain.UserSubscription, error)
	GetByUserID(ctx context.Context, userID uint) (*domain.UserSubscription, error)
	Upsert(ctx context.Context, sub *domain.UserSubscription) error
	CreateBillingLog(ctx context.Context, log *domain.BillingLog) error
	IsNotificationProcessed(ctx context.Context, notificationID string) (bool, error)
	SaveWebhookEvent(ctx context.Context, event *domain.WebhookEvent) error
	GetActiveProducts(ctx context.Context) ([]domain.Product, error)
	ExpireOtherSubscriptionsInGroup(ctx context.Context, userID uint, groupID string, excludeOriginalID string) error
	GetExpiringSubscriptions(ctx context.Context, expiringBefore time.Time, limit int) ([]*domain.UserSubscription, error)
	Transaction(ctx context.Context, fn func(ctx context.Context) error) error
}

type EntitlementRepository interface {
	GetByProductID(ctx context.Context, productID string) (*domain.Entitlement, error)
}
