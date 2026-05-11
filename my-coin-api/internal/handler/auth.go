package handler

import (
	"net/http"

	"github.com/Sinton/my-coin-api/internal/dto"
	"github.com/Sinton/my-coin-api/internal/service"
	"github.com/Sinton/my-coin-api/pkg/response"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

func (h *AuthHandler) AppleLogin(c *gin.Context) {
	var req dto.AppleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, response.CodeInvalidParams, "invalid request")
		return
	}

	result, err := h.authService.AppleLogin(c.Request.Context(), req.IdentityToken)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, dto.LoginResponse{
		AccessToken:  result.AccessToken,
		RefreshToken: result.RefreshToken,
		User:         dto.MapUserToDTO(result.User),
	})
}

