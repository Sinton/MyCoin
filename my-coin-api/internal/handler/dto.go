package handler

import "time"

type SubscriptionResponse struct {
	IsMember   bool                   `json:"is_member"`
	Status     string                 `json:"status"`
	ExpireTime *time.Time             `json:"expire_time"`
	PlanID     string                 `json:"plan_id"`
	Features   map[string]interface{} `json:"features"`
}

type ProductResponse struct {
	ProductID string `json:"product_id"`
	Name      string `json:"name"`
	Plan      string `json:"plan"`
	Type      string `json:"type"`
	SortOrder int    `json:"sort_order"`
}

type VerifyResponse struct {
	IsValid    bool       `json:"is_valid"`
	Status     string     `json:"status"`
	ExpireTime *time.Time `json:"expire_time"`
	ProductID  string     `json:"product_id"`
}

