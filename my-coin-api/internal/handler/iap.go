package handler

import (
	"net/http"

	"github.com/Sinton/my-coin-api/internal/dto"
	"github.com/Sinton/my-coin-api/internal/service"
	"github.com/Sinton/my-coin-api/pkg/logger"
	"github.com/Sinton/my-coin-api/pkg/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type IAPHandler struct {
	iapService         *service.IAPService
	entitlementService *service.EntitlementService
}

func NewIAPHandler(iapService *service.IAPService, entitlementService *service.EntitlementService) *IAPHandler {
	return &IAPHandler{
		iapService:         iapService,
		entitlementService: entitlementService,
	}
}

func (h *IAPHandler) Verify(c *gin.Context) {
	ctx := c.Request.Context()
	userID := c.MustGet("user_id").(uint)

	var req dto.VerifyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, response.CodeInvalidParams, "invalid request")
		return
	}

	logger.Ctx(ctx).
	       Info("verifying transaction", 
	           zap.String("tx_id", req.TransactionID), 
	           zap.Uint("user_id", userID))

	sub, err := h.iapService.Verify(ctx, userID, req.TransactionID)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, dto.MapSubscriptionToDTO(sub))
}

func (h *IAPHandler) GetSubscription(c *gin.Context) {
	ctx := c.Request.Context()
	userID := c.MustGet("user_id").(uint)

	sub, err := h.iapService.GetUserSubscription(ctx, userID)
	if err != nil {
		// Return a default "Free" DTO
		response.Success(c, dto.SubscriptionDTO{
			IsMember: false,
			Status:   "none",
		})
		return
	}

	response.Success(c, dto.MapSubscriptionToDTO(sub))
}

func (h *IAPHandler) GetProducts(c *gin.Context) {
	ctx := c.Request.Context()
	products, err := h.iapService.GetProducts(ctx)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, dto.MapProductListToDTO(products))
}

func (h *IAPHandler) AppleNotify(c *gin.Context) {
	var req struct {
		SignedPayload string `json:"signedPayload" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, response.CodeInvalidParams, "invalid params")
		return
	}

	err := h.iapService.ProcessNotification(c.Request.Context(), req.SignedPayload)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, nil)
}
