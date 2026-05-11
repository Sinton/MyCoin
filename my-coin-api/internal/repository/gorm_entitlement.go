package repository

import (
	"context"
	"github.com/Sinton/my-coin-api/internal/domain"
	"gorm.io/gorm"
)

type GormEntitlementRepo struct {
	db *gorm.DB
}

func NewGormEntitlementRepo(db *gorm.DB) *GormEntitlementRepo {
	return &GormEntitlementRepo{db: db}
}

func (r *GormEntitlementRepo) GetByProductID(ctx context.Context, productID string) (*domain.Entitlement, error) {
	var ent domain.Entitlement
	err := r.db.WithContext(ctx).Where("product_id = ?", productID).First(&ent).Error
	return &ent, err
}
