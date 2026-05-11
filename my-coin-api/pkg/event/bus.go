package event

import (
	"context"
	"sync"

	"github.com/Sinton/my-coin-api/internal/domain"
	"github.com/Sinton/my-coin-api/pkg/logger"
	"go.uber.org/zap"
)

type InternalBus struct {
	handlers map[domain.EventType][]domain.EventHandler
	mu       sync.RWMutex
}

func NewInternalBus() *InternalBus {
	return &InternalBus{
		handlers: make(map[domain.EventType][]domain.EventHandler),
	}
}

func (b *InternalBus) Subscribe(eventType domain.EventType, handler domain.EventHandler) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.handlers[eventType] = append(b.handlers[eventType], handler)
}

func (b *InternalBus) Publish(ctx context.Context, event domain.Event) {
	b.mu.RLock()
	handlers, ok := b.handlers[event.Type]
	b.mu.RUnlock()

	if !ok {
		return
	}

	// Execute handlers asynchronously to avoid blocking the main flow
	for _, handler := range handlers {
		go func(h domain.EventHandler) {
			defer func() {
				if r := recover(); r != nil {
					logger.Log.Error("event handler panic", zap.Any("recover", r))
				}
			}()
			
			h(ctx, event)
		}(handler)
	}
}
