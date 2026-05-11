package database

import (
	"fmt"
	"time"

	"github.com/Sinton/my-coin-api/pkg/logger"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

func Init(cfg Config, models ...interface{}) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logger.Log.Fatal("failed to connect database", zap.Error(err))
	}

	sqlDB, err := DB.DB()
	if err != nil {
		logger.Log.Fatal("failed to get sql database", zap.Error(err))
	}

	// Set connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// 2. Run Versioned Migrations (golang-migrate)
	runMigrations(cfg)
	
	// 3. Auto Migrate (GORM - for emergency schema sync)
	if len(models) > 0 {
		if err := DB.AutoMigrate(models...); err != nil {
			logger.Log.Fatal("failed to auto migrate", zap.Error(err))
		}
		logger.Log.Info("Database auto migration completed")
	}

	logger.Log.Info("Database connected successfully")
}

func runMigrations(cfg Config) {
	mURL := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DBName, cfg.SSLMode)

	m, err := migrate.New("file://migrations", mURL)
	if err != nil {
		logger.Log.Warn("could not create migrate instance", zap.Error(err))
		return
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		logger.Log.Warn("could not run up migrations", zap.Error(err))
	} else {
		logger.Log.Info("database migrations applied successfully")
	}
}
