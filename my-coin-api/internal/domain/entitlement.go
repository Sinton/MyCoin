package domain

import (
	"time"
)

type Entitlement struct {
	ID        uint            `gorm:"primaryKey" json:"id"`
	ProductID string          `gorm:"type:text;uniqueIndex;not null" json:"product_id"`
	Plan      string          `gorm:"type:text" json:"plan"` // pro, plus, free
	Features  map[string]interface{} `gorm:"serializer:json" json:"features"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

func (Entitlement) TableName() string {
	return "entitlements"
}
