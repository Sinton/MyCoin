package logger

import (
	"context"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Log *zap.Logger

func Init() {
	config := zap.NewProductionConfig()
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	
	logger, _ := config.Build()
	Log = logger
}

// Ctx returns a logger with request_id from context
func Ctx(ctx context.Context) *zap.Logger {
	if ctx == nil {
		return Log
	}
	if rid, ok := ctx.Value("request_id").(string); ok {
		return Log.With(zap.String("request_id", rid))
	}
	return Log
}

