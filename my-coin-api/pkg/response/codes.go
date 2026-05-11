package response

const (
	CodeSuccess = 200
	
	// Client Errors (4xx range mapping)
	CodeBadRequest     = 40001
	CodeUnauthorized   = 40002
	CodeInvalidParams  = 40003
	CodeExpiredToken   = 40004
	
	// IAP Specific Errors
	CodeVerifyFailed   = 40101
	CodeProductNotFound = 40102
	
	// Server Errors (5xx range mapping)
	CodeInternalError  = 50001
	CodeDatabaseError  = 50002
	CodeAppleAPIError  = 50003
)

var CodeMsg = map[int]string{
	CodeSuccess:         "success",
	CodeBadRequest:      "bad request",
	CodeUnauthorized:    "unauthorized",
	CodeInvalidParams:   "invalid parameters",
	CodeVerifyFailed:    "subscription verification failed",
	CodeInternalError:   "internal server error",
	CodeAppleAPIError:   "apple service communication error",
}
