package config

import (
	"strings"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	App struct {
		Port int
		Mode string
	}
	Database struct {
		Host     string
		Port     int
		User     string
		Password string
		DBName   string
		SSLMode  string
	}
	Redis struct {
		Host     string
		Port     int
		Password string
		DB       int
	}
	JWT struct {
		Secret         string
		AccessTimeout  time.Duration
		RefreshTimeout time.Duration
	}
	Apple struct {
		IssuerID       string
		KeyID          string
		BundleID       string
		PrivateKeyPath string
		IsSandbox      bool
	}
}

func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("configs")
	
	// Support environment variables
	viper.SetEnvPrefix("APP") // Use APP_ prefix for all env vars
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	// Defaults
	viper.SetDefault("app.port", 8080)
	viper.SetDefault("app.mode", "debug")
	viper.SetDefault("jwt.access_timeout", "2h")
	viper.SetDefault("jwt.refresh_timeout", "720h")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
