package dto

import "github.com/Sinton/my-coin-api/internal/domain"

// AppleLoginRequest defines the input for Apple login
type AppleLoginRequest struct {
	IdentityToken string `json:"identityToken" binding:"required"`
}

// UserDTO defines the safe user information returned to the client
type UserDTO struct {
	ID          uint   `json:"id"`
	AppleID     string `json:"appleId"`
	LastLoginAt string `json:"lastLoginAt"`
}

// LoginResponse defines the successful login output
type LoginResponse struct {
	AccessToken  string  `json:"accessToken"`
	RefreshToken string  `json:"refreshToken"`
	User         UserDTO `json:"user"`
}

// MapUserToDTO converts a domain user to a safe DTO
func MapUserToDTO(user *domain.User) UserDTO {
	return UserDTO{
		ID:          user.ID,
		AppleID:     user.AppleID,
		LastLoginAt: user.LastLoginAt.Format("2006-01-02 15:04:05"),
	}
}
