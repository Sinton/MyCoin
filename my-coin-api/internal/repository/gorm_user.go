package repository

import (
	"github.com/Sinton/my-coin-api/internal/domain"
	"gorm.io/gorm"
)

type GormUserRepo struct {
	db *gorm.DB
}

func NewGormUserRepo(db *gorm.DB) *GormUserRepo {
	return &GormUserRepo{db: db}
}

func (r *GormUserRepo) GetByAppleID(appleID string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("apple_id = ?", appleID).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepo) Create(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *GormUserRepo) Update(user *domain.User) error {
	return r.db.Save(user).Error
}
