package middleware

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const RequestIDKey = "request_id"

// RequestIDMiddleware injects a unique request ID into the context
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}

		// Set in header for client
		c.Header("X-Request-ID", requestID)
		
		// Set in Gin context
		c.Set(RequestIDKey, requestID)
		
		// Set in Go context (for service/repo layers)
		ctx := context.WithValue(c.Request.Context(), RequestIDKey, requestID)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}

// GetRequestID retrieves the request ID from context
func GetRequestID(ctx context.Context) string {
	if rid, ok := ctx.Value(RequestIDKey).(string); ok {
		return rid
	}
	return ""
}

