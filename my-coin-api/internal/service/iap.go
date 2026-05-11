package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Sinton/my-coin-api/internal/domain"
	"github.com/Sinton/my-coin-api/internal/domain/repository"
	"github.com/Sinton/my-coin-api/pkg/logger"
	"github.com/Sinton/my-coin-api/pkg/response"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type IAPService struct {
	provider domain.IAPProvider
	repo     repository.SubscriptionRepository
	rdb      *redis.Client
	bus      domain.EventBus
}

func NewIAPService(provider domain.IAPProvider, repo repository.SubscriptionRepository, rdb *redis.Client, bus domain.EventBus) *IAPService {
	return &IAPService{
		provider: provider,
		repo:     repo,
		rdb:      rdb,
		bus:      bus,
	}
}

func (s *IAPService) Verify(ctx context.Context, userID uint, transactionID string) (*domain.UserSubscription, error) {
	txInfo, err := s.provider.VerifyTransaction(ctx, transactionID)
	if err != nil {
		return nil, domain.ErrProviderDown
	}

	return s.syncTransaction(ctx, userID, txInfo, "")
}

func (s *IAPService) ProcessNotification(ctx context.Context, payload string) error {
	notif, err := s.provider.HandleNotification(ctx, payload)
	if err != nil {
		return domain.ErrReceiptInvalid
	}

	processed, err := s.repo.IsNotificationProcessed(ctx, notif.NotificationID)
	if err != nil {
		return domain.ErrInternalDatabase
	}
	if processed {
		return nil
	}

	statusOverride := domain.SubscriptionStatus("")
	if s.provider.GetProviderName() == "apple" {
		statusOverride = domain.MapAppleNotificationToStatus(notif.NotificationType)
	}

	sub, err := s.repo.GetByOriginalTransactionID(ctx, notif.Transaction.OriginalTransactionID)
	if err != nil {
		logger.Ctx(ctx).
		       Warn("received notification for unknown subscription", 
		           zap.String("original_id", notif.Transaction.OriginalTransactionID), 
		           zap.String("type", notif.NotificationType))
		return nil
	}

	_, err = s.syncTransaction(ctx, sub.UserID, notif.Transaction, statusOverride)
	if err != nil {
		return err
	}
	
	s.repo.SaveWebhookEvent(ctx, &domain.WebhookEvent{
		NotificationID: notif.NotificationID,
		Payload:        serialize(notif.RawPayload),
	})

	return nil
}

func (s *IAPService) syncTransaction(ctx context.Context, userID uint, info *domain.TransactionInfo, statusOverride domain.SubscriptionStatus) (*domain.UserSubscription, error) {
	endTime := time.Unix(info.ExpiresDate/1000, 0)
	startTime := time.Unix(info.PurchaseDate/1000, 0)

	status := domain.StatusActive
	if statusOverride != "" {
		status = statusOverride
	} else if time.Now().After(endTime) {
		status = domain.StatusExpired
	}

	sub := &domain.UserSubscription{
		UserID:                userID,
		ProductID:             info.ProductID,
		SubscriptionGroupID:   info.SubscriptionGroupID,
		Status:                status,
		StartTime:             &startTime,
		EndTime:               &endTime,
		Price:                 info.Price,
		Currency:              info.Currency,
		IsTrialConsumed:       info.IsTrial,
		OriginalTransactionID: info.OriginalTransactionID,
		LatestTransactionID:   info.TransactionID,
		Environment:           info.Environment,
	}

	// Use Atomic Transaction
	err := s.repo.Transaction(ctx, func(txCtx context.Context) error {
		if err := s.repo.Upsert(txCtx, sub); err != nil {
			return err
		}

		if status == domain.StatusActive && sub.SubscriptionGroupID != "" {
			if err := s.repo.ExpireOtherSubscriptionsInGroup(txCtx, userID, sub.SubscriptionGroupID, sub.OriginalTransactionID); err != nil {
				return err
			}
		}

		return s.repo.CreateBillingLog(txCtx, &domain.BillingLog{
			UserID:        userID,
			TransactionID: sub.LatestTransactionID,
			ProductID:     sub.ProductID,
			Price:         sub.Price,
			Currency:      sub.Currency,
			EventType:     "SYNC",
			Payload:       []byte(fmt.Sprintf("provider: %s", s.provider.GetProviderName())),
		})
	})

	if err != nil {
		return nil, domain.ErrInternalDatabase
	}

	// Publish Event (Outside transaction, since side-effects like logging don't need to be rolled back)
	s.bus.Publish(ctx, domain.Event{
		Type: domain.EventSubscriptionSynced,
		Data: sub,
	})

	return sub, nil
}

func (s *IAPService) SyncSubscription(ctx context.Context, sub *domain.UserSubscription) error {
	history, err := s.provider.GetSubscriptionHistory(ctx, sub.OriginalTransactionID)
	if err != nil {
		return err
	}

	if len(history) == 0 {
		return nil
	}

	// Find the latest transaction (highest expiresDate)
	var latestInfo *domain.TransactionInfo
	for _, info := range history {
		if latestInfo == nil || info.ExpiresDate > latestInfo.ExpiresDate {
			latestInfo = info
		}
	}

	if latestInfo != nil {
		_, err = s.syncTransaction(ctx, sub.UserID, latestInfo, "")
		return err
	}

	return nil
}

func (s *IAPService) GetUserSubscription(ctx context.Context, userID uint) (*domain.UserSubscription, error) {
	dummySub := &domain.UserSubscription{UserID: userID}
	cacheKey := dummySub.CacheKey()
	
	if val, err := s.rdb.Get(ctx, cacheKey).Result(); err == nil {
		var sub domain.UserSubscription
		if json.Unmarshal([]byte(val), &sub) == nil {
			return &sub, nil
		}
	}

	sub, err := s.repo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, response.NewError(response.CodeDatabaseError, "user has no subscription", err)
	}

	data, _ := json.Marshal(sub)
	s.rdb.
	     Set(ctx, cacheKey, data, 5*time.Minute).
	     Err()
	
	return sub, nil
}

func (s *IAPService) GetProducts(ctx context.Context) ([]domain.Product, error) {
	products, err := s.repo.GetActiveProducts(ctx)
	if err != nil {
		return nil, response.NewError(response.CodeDatabaseError, "failed to fetch products", err)
	}
	return products, nil
}

func serialize(v interface{}) []byte {
	b, _ := json.Marshal(v)
	return b
}

