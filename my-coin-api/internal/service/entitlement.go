package service

import (
	"context"
	"github.com/Sinton/my-coin-api/internal/domain/repository"
	"github.com/Sinton/my-coin-api/pkg/logger"
	"go.uber.org/zap"
)

type EntitlementService struct {
	repo repository.EntitlementRepository
}

func NewEntitlementService(repo repository.EntitlementRepository) *EntitlementService {
	return &EntitlementService{repo: repo}
}

func (s *EntitlementService) ResolveFeatures(ctx context.Context, productID string) (map[string]interface{}, error) {
	ent, err := s.repo.GetByProductID(ctx, productID)
	if err != nil {
		logger.Log.Warn("entitlement not found for product", zap.String("product_id", productID))
		return map[string]interface{}{}, nil
	}
	return ent.Features, nil
}

