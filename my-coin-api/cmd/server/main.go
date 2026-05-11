package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Sinton/my-coin-api/internal/config"
	"github.com/Sinton/my-coin-api/internal/cron"
	"github.com/Sinton/my-coin-api/internal/domain"
	"github.com/Sinton/my-coin-api/internal/handler"
	"github.com/Sinton/my-coin-api/internal/infrastructure/apple"
	"github.com/Sinton/my-coin-api/internal/middleware"
	"github.com/Sinton/my-coin-api/internal/repository"
	"github.com/Sinton/my-coin-api/internal/service"
	"github.com/Sinton/my-coin-api/pkg/database"
	"github.com/Sinton/my-coin-api/pkg/event"
	"github.com/Sinton/my-coin-api/pkg/jwt"
	"github.com/Sinton/my-coin-api/pkg/logger"
	"github.com/Sinton/my-coin-api/pkg/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// 1. Initialize Logger
	logger.Init()
	defer logger.Log.Sync()

	// 2. Load Config
	cfg, err := config.Load()
	if err != nil {
		logger.Log.Fatal("failed to load config", zap.Error(err))
	}

	// 3. Initialize Database (Migrations handled inside)
	database.Init(database.Config{
		Host:     cfg.Database.Host,
		Port:     cfg.Database.Port,
		User:     cfg.Database.User,
		Password: cfg.Database.Password,
		DBName:   cfg.Database.DBName,
		SSLMode:  cfg.Database.SSLMode,
	}, 
		&domain.User{}, 
		&domain.Product{}, 
		&domain.Entitlement{}, 
		&domain.UserSubscription{}, 
		&domain.WebhookEvent{}, 
		&domain.BillingLog{},
	)

	// 3.1 Initialize Redis
	database.InitRedis(database.RedisConfig{
		Host:     cfg.Redis.Host,
		Port:     cfg.Redis.Port,
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
	})

	// 4. Initialize Infrastructure & Repositories
	appleClient, _ := apple.NewClient(cfg)
	iapRepo := repository.NewGormSubscriptionRepo(database.DB)
	entRepo := repository.NewGormEntitlementRepo(database.DB)
	userRepo := repository.NewGormUserRepo(database.DB)

	// 4.1 Initialize JWT Manager
	jwtManager := jwt.NewJWTManager(cfg.JWT.Secret, time.Hour*24, time.Hour*24*30)

	// 5. Initialize Event Bus & Listeners
	eventBus := event.NewInternalBus()
	
	// Listener: Logging
	eventBus.Subscribe(domain.EventSubscriptionSynced, func(ctx context.Context, e domain.Event) {
		sub := e.Data.(*domain.UserSubscription)
		logger.LogSubscription(sub.UserID, sub.ProductID, string(sub.Status), sub.Price, sub.Currency)
	})

	// Listener: Cache Invalidation
	eventBus.Subscribe(domain.EventSubscriptionSynced, func(ctx context.Context, e domain.Event) {
		sub := e.Data.(*domain.UserSubscription)
		database.RDB.Del(ctx, sub.CacheKey())
	})

	// 5.1 Initialize Services
	authService := service.NewAuthService(appleClient, userRepo, jwtManager)
	iapService := service.NewIAPService(appleClient, iapRepo, database.RDB, eventBus)
	entService := service.NewEntitlementService(entRepo)

	// 6. Initialize Handlers
	authHandler := handler.NewAuthHandler(authService)
	iapHandler := handler.NewIAPHandler(iapService, entService)

	// 7. Initialize Cron
	cronManager := cron.NewIAPCronManager(iapService, iapRepo, database.RDB)
	cronManager.Start()

	// 8. Setup Gin
	if cfg.App.Mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.RequestIDMiddleware())

	// Logging middleware
	r.Use(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		c.Next()
		logger.Log.Info("request",
			zap.Int("status", c.Writer.Status()),
			zap.String("method", c.Request.Method),
			zap.String("path", path),
			zap.Duration("latency", time.Since(start)),
		)
	})

	// 9. Register Routes
	v1 := r.Group("/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			response.Success(c, gin.H{"status": "ok"})
		})

		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/apple", authHandler.AppleLogin)
		}

		v1.POST("/iap/apple/notify", iapHandler.AppleNotify)
		v1.GET("/iap/products", iapHandler.GetProducts)

		iapGroup := v1.Group("/iap")
		iapGroup.Use(middleware.AuthMiddleware(jwtManager))
		{
			iapGroup.POST("/verify", iapHandler.Verify)
		}

		userGroup := v1.Group("/user")
		userGroup.Use(middleware.AuthMiddleware(jwtManager))
		{
			userGroup.GET("/subscription", iapHandler.GetSubscription)
		}
	}

	// 8. Start Server with Graceful Shutdown
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.App.Port),
		Handler: r,
	}

	go func() {
		logger.Log.Info("Server is running", zap.Int("port", cfg.App.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Log.Fatal("listen error", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Log.Info("Shutting down server...")

	// 1. Stop Cron Jobs
	logger.Log.Info("Stopping Cron jobs...")
	cronManager.Stop()

	// 2. Shutdown HTTP Server
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Log.Fatal("Server forced to shutdown", zap.Error(err))
	}

	// 3. Close Database Connections
	logger.Log.Info("Closing database connections...")
	sqlDB, _ := database.DB.DB()
	if sqlDB != nil {
		sqlDB.Close()
	}
	if database.RDB != nil {
		database.RDB.Close()
	}

	logger.Log.Info("Server exiting gracefully")
}
