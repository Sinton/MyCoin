package repository

import (
	"context"
	"time"

	"github.com/Sinton/my-coin-api/internal/domain"
	"gorm.io/gorm"
)

type GormSubscriptionRepo struct {
	db *gorm.DB
}

func NewGormSubscriptionRepo(db *gorm.DB) *GormSubscriptionRepo {
	return &GormSubscriptionRepo{db: db}
}

func (r *GormSubscriptionRepo) getDB(ctx context.Context) *gorm.DB {
	if tx, ok := ctx.Value("tx").(*gorm.DB); ok {
		return tx.WithContext(ctx)
	}
	return r.db.WithContext(ctx)
}

func (r *GormSubscriptionRepo) GetByOriginalTransactionID(ctx context.Context, id string) (*domain.UserSubscription, error) {
	var sub domain.UserSubscription
	err := r.getDB(ctx).
	         Where("original_transaction_id = ?", id).
	         First(&sub).
	         Error
	return &sub, err
}

func (r *GormSubscriptionRepo) GetByUserID(ctx context.Context, userID uint) (*domain.UserSubscription, error) {
	var sub domain.UserSubscription
	err := r.getDB(ctx).
	         Where("user_id = ?", userID).
	         Order("end_time desc").
	         First(&sub).
	         Error
	return &sub, err
}

func (r *GormSubscriptionRepo) Upsert(ctx context.Context, sub *domain.UserSubscription) error {
	return r.getDB(ctx).
	         Where("original_transaction_id = ?", sub.OriginalTransactionID).
	         Assign(sub).
	         FirstOrCreate(sub).
	         Error
}

func (r *GormSubscriptionRepo) CreateBillingLog(ctx context.Context, log *domain.BillingLog) error {
	return r.getDB(ctx).
	         Create(log).
	         Error
}

func (r *GormSubscriptionRepo) IsNotificationProcessed(ctx context.Context, notificationID string) (bool, error) {
	var event domain.WebhookEvent
	err := r.getDB(ctx).
	         Where("notification_id = ?", notificationID).
	         First(&event).
	         Error
	if err == nil {
		return true, nil
	}
	if err == gorm.ErrRecordNotFound {
		return false, nil
	}
	return false, err
}

func (r *GormSubscriptionRepo) SaveWebhookEvent(ctx context.Context, event *domain.WebhookEvent) error {
	return r.getDB(ctx).
	         Create(event).
	         Error
}

func (r *GormSubscriptionRepo) GetActiveProducts(ctx context.Context) ([]domain.Product, error) {
	var products []domain.Product
	err := r.getDB(ctx).
	         Where("is_active = ?", true).
	         Order("sort_order asc").
	         Find(&products).
	         Error
	return products, err
}

func (r *GormSubscriptionRepo) ExpireOtherSubscriptionsInGroup(ctx context.Context, userID uint, groupID string, excludeOriginalID string) error {
	return r.getDB(ctx).
	         Model(&domain.UserSubscription{}).
	         Where("user_id = ? AND subscription_group_id = ? AND original_transaction_id != ?", userID, groupID, excludeOriginalID).
	         Update("status", domain.StatusExpired).
	         Error
}

func (r *GormSubscriptionRepo) GetExpiringSubscriptions(ctx context.Context, expiringBefore time.Time, limit int) ([]*domain.UserSubscription, error) {
	var subs []*domain.UserSubscription
	err := r.getDB(ctx).
	         Where("status = ? AND end_time <= ?", domain.StatusActive, expiringBefore).
	         Limit(limit).
	         Find(&subs).
	         Error
	return subs, err
}

func (r *GormSubscriptionRepo) Transaction(ctx context.Context, fn func(ctx context.Context) error) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		txCtx := context.WithValue(ctx, "tx", tx)
		return fn(txCtx)
	})
}
