package domain

import (
	"time"
)

type User struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	AppleID       string    `gorm:"uniqueIndex;size:128" json:"apple_id"`
	Email         string    `json:"email"`
	Nickname      string    `json:"nickname"`
	LastLoginAt   time.Time `json:"last_login_at"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type UserRepository interface {
	GetByAppleID(appleID string) (*User, error)
	Create(user *User) error
	Update(user *User) error
}
