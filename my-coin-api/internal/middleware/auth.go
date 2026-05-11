package middleware

import (
	"net/http"
	"strings"

	"github.com/Sinton/my-coin-api/pkg/jwt"
	"github.com/Sinton/my-coin-api/pkg/response"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(jwtManager *jwt.JWTManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, http.StatusUnauthorized, 401, "authorization header is required")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			response.Error(c, http.StatusUnauthorized, 401, "invalid authorization header format")
			c.Abort()
			return
		}

		claims, err := jwtManager.ValidateToken(parts[1])
		if err != nil {
			response.Error(c, http.StatusUnauthorized, 401, err.Error())
			c.Abort()
			return
		}

		// Set user identity to context
		c.Set("user_id", claims.UserID)
		c.Next()
	}
}
