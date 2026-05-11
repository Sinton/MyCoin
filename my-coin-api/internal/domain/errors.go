package domain

import "errors"

var (
	// Authentication Errors
	ErrUserNotFound      = errors.New("user not found")
	ErrInvalidToken      = errors.New("invalid identity token")
	ErrUnauthorized      = errors.New("unauthorized access")

	// IAP / Payment Errors
	ErrSubscriptionNotFound = errors.New("subscription not found")
	ErrReceiptInvalid       = errors.New("invalid purchase receipt")
	ErrProviderDown         = errors.New("payment provider is temporarily unavailable")
	ErrProductNotFound      = errors.New("requested product does not exist")
	ErrDuplicateNotification = errors.New("notification already processed")

	// Common Resource Errors
	ErrInternalDatabase    = errors.New("internal database error")
	ErrConflict            = errors.New("resource conflict")
)
