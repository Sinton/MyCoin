package dto

import (
	"time"
	"github.com/Sinton/my-coin-api/internal/domain"
)

// VerifyRequest defines the input for transaction verification
type VerifyRequest struct {
	TransactionID string `json:"transactionId" binding:"required"`
}

// SubscriptionDTO defines the subscription details returned to the client
type SubscriptionDTO struct {
	IsMember   bool       `json:"isMember"`
	Status     string     `json:"status"`
	ProductID  string     `json:"productId"`
	ExpireTime *time.Time `json:"expireTime"`
}

// ProductDTO defines the product information returned to the client
type ProductDTO struct {
	ProductID string `json:"productId"`
	Name      string `json:"name"`
	Plan      string `json:"plan"`
	Type      string `json:"type"`
	SortOrder int    `json:"sortOrder"`
}

// MapSubscriptionToDTO converts a domain subscription to a client-friendly DTO
func MapSubscriptionToDTO(sub *domain.UserSubscription) SubscriptionDTO {
	isMember := sub.Status == domain.StatusActive || sub.Status == "grace"
	return SubscriptionDTO{
		IsMember:   isMember,
		Status:     string(sub.Status),
		ProductID:  sub.ProductID,
		ExpireTime: sub.EndTime,
	}
}

// MapProductListToDTO converts a list of domain products to DTOs
func MapProductListToDTO(products []domain.Product) []ProductDTO {
	res := make([]ProductDTO, len(products))
	for i, p := range products {
		res[i] = ProductDTO{
			ProductID: p.ProductID,
			Name:      p.Name,
			Plan:      p.Plan,
			Type:      p.Type,
			SortOrder: p.SortOrder,
		}
	}
	return res
}
