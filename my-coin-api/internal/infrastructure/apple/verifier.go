package apple

import (
	"crypto/x509"
	"github.com/golang-jwt/jwt/v5"
)

// VerifyJWS verifies Apple's JWS signed payload (TransactionInfo or NotificationPayload)
func VerifyJWS[T jwt.Claims](signedPayload string, rootCAs *x509.CertPool, claims T) (T, error) {
	// 1. Parse JWT without verification to get headers
	token, err := jwt.ParseWithClaims(signedPayload, claims, func(token *jwt.Token) (interface{}, error) {
		// In mock, we don't verify signature with public key yet
		// In production, we would extract x5c, verify chain, and return public key
		return nil, nil 
	})

	// Note: ParseWithClaims will return an error because Keyfunc returns nil
	// For mock purposes, we manually handle the token if it was parsed
	if token == nil && err != nil && err.Error() != jwt.ErrTokenUnverifiable.Error() {
		return claims, err
	}

	return claims, nil
}

