package database

import (
	"context"
	"fmt"
	"time"

	"github.com/Sinton/my-coin-api/pkg/logger"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

var RDB *redis.Client

type RedisConfig struct {
	Host     string
	Port     int
	Password string
	DB       int
}

func InitRedis(cfg RedisConfig) {
	RDB = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := RDB.Ping(ctx).Err(); err != nil {
		logger.Log.Warn("failed to connect to redis", zap.Error(err))
		return
	}

	logger.Log.Info("Redis connected successfully")
}
