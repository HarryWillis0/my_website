package route

import (
	"sync"
	"time"
)

type routeCacheItem struct {
	Route
	expiresAt time.Time
}

type routeCache struct {
	items map[string]routeCacheItem
	mu    sync.RWMutex
}

func NewRouteCache() *routeCache {
	return &routeCache{
		items: make(map[string]routeCacheItem),
		mu:    sync.RWMutex{},
	}
}

func (rc *routeCache) Get(articleId string) (Route, bool) {
	rc.mu.RLock()
	defer rc.mu.RUnlock()

	item, exists := rc.items[articleId]
	if !exists || time.Now().After(item.expiresAt) {
		return Route{}, false
	}
	return item.Route, true
}

func (rc *routeCache) Set(articleId string, route Route, duration time.Duration) {
	rc.mu.Lock()
	defer rc.mu.Unlock()

	rc.items[articleId] = routeCacheItem{
		Route:     route,
		expiresAt: time.Now().Add(duration),
	}
}
