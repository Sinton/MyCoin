package cron

import (
	"context"
	"time"

	"github.com/Sinton/my-coin-api/internal/domain/repository"
	"github.com/Sinton/my-coin-api/internal/service"
	"github.com/Sinton/my-coin-api/pkg/logger"
	"github.com/redis/go-redis/v9"
	"github.com/robfig/cron/v3"
	"go.uber.org/zap"
)

type IAPCronManager struct {
	service *service.IAPService
	repo    repository.SubscriptionRepository
	rdb     *redis.Client
	cron    *cron.Cron
}

func NewIAPCronManager(service *service.IAPService, repo repository.SubscriptionRepository, rdb *redis.Client) *IAPCronManager {
	return &IAPCronManager{
		service: service,
		repo:    repo,
		rdb:     rdb,
		cron:    cron.New(),
	}
}

func (m *IAPCronManager) Start() {
	m.cron.AddFunc("@every 1h", func() {
		m.SyncExpiringSubscriptions()
	})
	m.cron.Start()
	logger.Log.Info("IAP Cron Job started")
}

func (m *IAPCronManager) Stop() {
	ctx := m.cron.Stop()
	// Wait for any running jobs to finish
	<-ctx.Done()
}

func (m *IAPCronManager) SyncExpiringSubscriptions() {
	ctx := context.Background()
	
	// Distributed Lock: Ensure only one instance runs this at a time
	lockKey := "cron:iap:sync_lock"
	ok, err := m.rdb.SetNX(ctx, lockKey, "locked", 10*time.Minute).Result()
	if err != nil || !ok {
		// Lock failed or already held by another instance
		return
	}
	defer m.rdb.Del(ctx, lockKey)

	logger.Log.Info("Starting proactive subscription sync...")
	
	// Fetch subscriptions expiring in the next 24 hours
	expiringBefore := time.Now().Add(24 * time.Hour)
	
	subs, err := m.repo.GetExpiringSubscriptions(ctx, expiringBefore, 100)
	if err != nil {
		logger.Log.Error("failed to fetch expiring subscriptions", zap.Error(err))
		return
	}

	for _, sub := range subs {
		logger.Log.Info("syncing expiring subscription", 
		    zap.Uint("user_id", sub.UserID), 
		    zap.String("original_tx_id", sub.OriginalTransactionID))
		
		if err := m.service.SyncSubscription(ctx, sub); err != nil {
			logger.Log.Error("failed to sync subscription", 
			    zap.Error(err), 
			    zap.String("original_tx_id", sub.OriginalTransactionID))
		}
	}

	logger.Log.Info("Proactive subscription sync finished", zap.Int("count", len(subs)))
}

