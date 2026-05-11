package service

import (
	"context"
	"errors"
	"time"

	"github.com/Sinton/my-coin-api/internal/domain"
	"github.com/Sinton/my-coin-api/internal/infrastructure/apple"
	"github.com/Sinton/my-coin-api/pkg/jwt"
	"gorm.io/gorm"
)

type AuthService struct {
	appleClient *apple.Client
	userRepo    domain.UserRepository
	jwtManager  *jwt.JWTManager
}

func NewAuthService(appleClient *apple.Client, userRepo domain.UserRepository, jwtManager *jwt.JWTManager) *AuthService {
	return &AuthService{
		appleClient: appleClient,
		userRepo:    userRepo,
		jwtManager:  jwtManager,
	}
}

type LoginResult struct {
	AccessToken  string
	RefreshToken string
	User         *domain.User
}

func (s *AuthService) AppleLogin(ctx context.Context, identityToken string) (*LoginResult, error) {
	// 1. Verify Identity Token
	appleUserID, err := s.appleClient.VerifyIdentityToken(ctx, identityToken)
	if err != nil {
		return nil, domain.ErrInvalidToken
	}

	// 2. Find or Create User
	user, err := s.userRepo.GetByAppleID(appleUserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Register new user
			user = &domain.User{
				AppleID:     appleUserID,
				LastLoginAt: time.Now(),
			}
			if err := s.userRepo.Create(user); err != nil {
				return nil, domain.ErrInternalDatabase
			}
		} else {
			return nil, domain.ErrInternalDatabase
		}
	} else {
		// Update login time
		user.LastLoginAt = time.Now()
		_ = s.userRepo.Update(user)
	}

	// 3. Generate Tokens
	accessToken, err := s.jwtManager.GenerateAccessToken(user.ID)
	if err != nil {
		return nil, err
	}
	refreshToken, err := s.jwtManager.GenerateRefreshToken()
	if err != nil {
		return nil, err
	}

	return &LoginResult{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         user,
	}, nil
}
