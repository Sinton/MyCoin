package response

import (
	"errors"
	"net/http"

	"github.com/Sinton/my-coin-api/internal/domain"
	"github.com/gin-gonic/gin"
)

type Response struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data,omitempty"`
}

func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code: 200,
		Msg:  "success",
		Data: data,
	})
}

// Error handles both standard errors and custom AppErrors
func Error(c *gin.Context, httpCode int, businessCode int, msg string) {
	c.JSON(httpCode, Response{
		Code: businessCode,
		Msg:  msg,
	})
}

// HandleError is the unified way to handle all errors (domain, internal, etc.)
func HandleError(c *gin.Context, err error) {
	if err == nil {
		return
	}

	var httpCode int
	var bizCode int
	var msg string

	// 1. Map Domain Errors to HTTP/Business Codes
	switch {
	case errors.Is(err, domain.ErrUnauthorized), errors.Is(err, domain.ErrInvalidToken):
		httpCode, bizCode = http.StatusUnauthorized, CodeUnauthorized
	case errors.Is(err, domain.ErrUserNotFound), errors.Is(err, domain.ErrProductNotFound), errors.Is(err, domain.ErrSubscriptionNotFound):
		httpCode, bizCode = http.StatusNotFound, CodeProductNotFound
	case errors.Is(err, domain.ErrReceiptInvalid):
		httpCode, bizCode = http.StatusUnprocessableEntity, CodeVerifyFailed
	case errors.Is(err, domain.ErrProviderDown):
		httpCode, bizCode = http.StatusServiceUnavailable, CodeAppleAPIError
	case errors.Is(err, domain.ErrInternalDatabase):
		httpCode, bizCode = http.StatusInternalServerError, CodeDatabaseError
	default:
		// 2. Handle wrapped AppErrors or unknown errors
		if appErr, ok := err.(*AppError); ok {
			httpCode = http.StatusBadRequest
			if appErr.Code >= 50000 {
				httpCode = http.StatusInternalServerError
			}
			bizCode, msg = appErr.Code, appErr.Msg
		} else {
			httpCode, bizCode = http.StatusInternalServerError, CodeInternalError
			msg = err.Error()
		}
	}

	if msg == "" {
		msg = err.Error()
	}

	Error(c, httpCode, bizCode, msg)
}

