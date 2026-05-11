package response

import "fmt"

// AppError is a custom error type that carries business code and technical error
type AppError struct {
	Code int
	Msg  string
	Err  error
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("[%d] %s: %v", e.Code, e.Msg, e.Err)
	}
	return fmt.Sprintf("[%d] %s", e.Code, e.Msg)
}

func NewError(code int, msg string, err error) *AppError {
	return &AppError{
		Code: code,
		Msg:  msg,
		Err:  err,
	}
}

// Predefined errors (optional, can be moved to a domain layer later)
var (
	ErrSubscriptionNotFound = &AppError{Code: 40101, Msg: "subscription not found"}
	ErrAppleVerifyFailed    = &AppError{Code: 40102, Msg: "apple verification failed"}
)

