package domain

import "context"

type EventType string

const (
	EventSubscriptionSynced EventType = "subscription.synced"
)

// Event represents a generic domain event
type Event struct {
	Type EventType
	Data interface{}
}

// EventHandler is a function that processes an event
type EventHandler func(ctx context.Context, event Event)

// EventBus defines the interface for publishing and subscribing to events
type EventBus interface {
	Publish(ctx context.Context, event Event)
	Subscribe(eventType EventType, handler EventHandler)
}
