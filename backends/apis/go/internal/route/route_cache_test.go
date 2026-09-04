package route

import (
	"sync"
	"testing"
	"time"
)

func TestNewRouteCache_ReturnsNonNilCache(t *testing.T) {
	cache := NewRouteCache()
	if cache == nil {
		t.Errorf("expected non-nil cache, got nil")
	}
}

func TestGet_ItemDoesNotExist_ReturnsEmptyAndFalse(t *testing.T) {
	cache := NewRouteCache()
	route, exists := cache.Get("nonexistent-article-id")

	if !route.IsEmpty() {
		t.Errorf("expected empty route, got %v", route)
	}

	if exists {
		t.Errorf("expected exists to be false for nonexistent item, got true")
	}
}

func TestGet_ItemsExistAndExpired_ReturnsEmptyAndFalse(t *testing.T) {
	cache := NewRouteCache()
	route := Route{
		Points:        []RoutePoint{{Lat: 1.0, Lon: 2.0, Ele: 3.0, Distance: 4.0}},
		Distance:      4.0,
		ElevationGain: 3.0,
	}
	cache.Set("expired-article-id", route, -1*time.Hour) // Set with negative duration to simulate expiration

	retrievedRoute, exists := cache.Get("expired-article-id")

	if !retrievedRoute.IsEmpty() {
		t.Errorf("expected empty route for expired item, got %v", retrievedRoute)
	}

	if exists {
		t.Errorf("expected exists to be false for expired item, got true")
	}
}

func TestGet_ItemsExistAndNotExpired_ReturnsRouteAndTrue(t *testing.T) {
	cache := NewRouteCache()
	route := Route{
		Points:        []RoutePoint{{Lat: 1.0, Lon: 2.0, Ele: 3.0, Distance: 4.0}},
		Distance:      4.0,
		ElevationGain: 3.0,
	}
	cache.Set("valid-article-id", route, 1*time.Hour) // Set with positive duration

	retrievedRoute, exists := cache.Get("valid-article-id")

	if retrievedRoute.IsEmpty() {
		t.Errorf("expected non-empty route for valid item, got empty route")
	}

	if !exists {
		t.Errorf("expected exists to be true for valid item, got false")
	}
}

func TestCache_ConcurrentReadAndWrite_IsSafe(t *testing.T) {
	cache := NewRouteCache()
	articleID := "concurrent-id"
	route := Route{Distance: 10.0}

	startSignal := make(chan struct{})
	var wg sync.WaitGroup
	wg.Add(2)

	// Goroutine 1: Continuous Writer
	go func() {
		defer wg.Done()
		<-startSignal
		cache.Set(articleID, route, 1*time.Hour)
	}()

	// Goroutine 2: Continuous Reader
	go func() {
		defer wg.Done()
		<-startSignal
		_, _ = cache.Get(articleID)
	}()

	// Unleash both at the exact same moment
	close(startSignal)
	wg.Wait()
}
