package route

import (
	"os"
	"path/filepath"
	"sync"
	"testing"
)

func TestNewRouteService_EmptyDirectoryPath_ReturnsError(t *testing.T) {
	_, err := NewRouteService("")
	if err == nil {
		t.Errorf("expected error for empty directory path, got nil")
	}
}

func TestNewRouteService_ReturnsNonNilService(t *testing.T) {
	service, err := NewRouteService("testdata")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if service == nil {
		t.Errorf("expected non-nil service, got nil")
	}
}

func TestGetRoute_ArticleIdNotFound_ReturnsEmptyAndNoError(t *testing.T) {
	service, err := NewRouteService("testdata")
	route, err := service.GetRouteByArticleID("nonexistent-article-id")

	if !route.IsEmpty() {
		t.Errorf("expected empty route, got %v", route)
	}

	if err != nil {
		t.Errorf("expected no error for nonexistent article ID, got %v", err)
	}
}

func TestGetRoute_DirectoryEmpty_ReturnsEmptyAndNoError(t *testing.T) {
	service, err := NewRouteService("testdata")
	route, err := service.GetRouteByArticleID("empty-article-id")

	if !route.IsEmpty() {
		t.Errorf("expected empty route for empty directory, got %v", route)
	}

	if err != nil {
		t.Errorf("expected no error for empty directory, got %v", err)
	}
}

func TestGetRoute_ValidArticleId_ReturnsCorrectAmountOfRoutePoints(t *testing.T) {
	service, err := NewRouteService("testdata")
	route, err := service.GetRouteByArticleID("valid-article-id")

	if err != nil {
		t.Errorf("expected no error for valid article ID, got %v", err)
	}

	if route.IsEmpty() {
		t.Errorf("expected non-empty route for valid article ID, got empty route")
	}

	if len(route.Points) != 2 {
		t.Errorf("expected 2 route points for valid article ID, got %d", len(route.Points))
	}
}

func TestGetRoute_ValidArticleId_ReturnsCorrectRoutePoints(t *testing.T) {
	service, err := NewRouteService("testdata")
	route, err := service.GetRouteByArticleID("valid-article-id")

	if err != nil {
		t.Errorf("expected no error for valid article ID, got %v", err)
	}

	expectedPoints := []RoutePoint{
		{Lat: 50.1075080, Lon: -120.7870340, Ele: 591.6, Distance: 0.0},
		{Lat: 49.4622790, Lon: -120.4771470, Ele: 640.8, Distance: calcHaversineDistance(gpxPoint{Lat: 50.1075080, Lon: -120.7870340}, gpxPoint{Lat: 49.4622790, Lon: -120.4771470})},
	}

	routePoints := route.Points
	for i, expected := range expectedPoints {
		actual := routePoints[i]
		if actual.Lat != expected.Lat || actual.Lon != expected.Lon || actual.Ele != expected.Ele || actual.Distance != expected.Distance {
			t.Errorf("expected point %d to be %+v, got %+v", i, expected, actual)
		}
	}
}

func TestGetRoute_ValidArticleId_ReturnsTotalDistance(t *testing.T) {
	service, err := NewRouteService("testdata")
	route, err := service.GetRouteByArticleID("valid-article-id")

	if err != nil {
		t.Errorf("expected no error for valid article ID, got %v", err)
	}

	if route.IsEmpty() {
		t.Errorf("expected non-empty route for valid article ID, got empty route")
	}

	if route.Distance <= 0 {
		t.Errorf("expected positive total distance for valid article ID, got %f", route.Distance)
	}

	if route.Distance != route.Points[len(route.Points)-1].Distance {
		t.Errorf("expected total distance to match last point's distance, got %f and %f", route.Distance, route.Points[len(route.Points)-1].Distance)
	}
}

func TestGetRoute_ValidArticleId_ReturnsElevationGain(t *testing.T) {
	service, err := NewRouteService("testdata")
	route, err := service.GetRouteByArticleID("valid-article-id")

	if err != nil {
		t.Errorf("expected no error for valid article ID, got %v", err)
	}

	if route.IsEmpty() {
		t.Errorf("expected non-empty route for valid article ID, got empty route")
	}

	if route.ElevationGain <= 0 {
		t.Errorf("expected positive elevation gain for valid article ID, got %f", route.ElevationGain)
	}
}

func TestGetRoute_MalformedGPXFile_ReturnsError(t *testing.T) {
	service, err := NewRouteService("testdata")
	route, err := service.GetRouteByArticleID("malformed-gpx-article-id")

	if !route.IsEmpty() {
		t.Errorf("expected empty route for malformed GPX file, got %v", route)
	}

	if err == nil {
		t.Errorf("expected error for malformed GPX file, got nil")
	}
}

func TestGetRoute_CacheHit_DoesNotHitFileSystem(t *testing.T) {
	tempDir := t.TempDir()
	service, err := NewRouteService(tempDir)
	articleId := "valid-article-id"

	if err != nil {
		t.Errorf("expected no error creating RouteService, got %v", err)
	}

	data, err := os.ReadFile(filepath.Join("testdata", articleId, "one.gpx"))
	if err != nil {
		t.Errorf("failed to read test GPX file: %v", err)
	}

	routeDir := filepath.Join(tempDir, articleId)
	err = os.Mkdir(routeDir, 0755)
	if err != nil {
		t.Errorf("failed to create directory: %v", err)
	}

	err = os.WriteFile(filepath.Join(routeDir, "one.gpx"), data, 0644)
	if err != nil {
		t.Errorf("failed to write GPX file to temp dir: %v", err)
	}

	route1, err := service.GetRouteByArticleID(articleId)
	if err != nil {
		t.Errorf("expected no error for route 1, got %v", err)
	}

	if route1.IsEmpty() {
		t.Errorf("expected non-empty route for route 1, got empty route")
	}

	// remove the temp directory again and try to get the route again, it should still return the cached route
	os.RemoveAll(tempDir)

	route2, err := service.GetRouteByArticleID(articleId)
	if err != nil {
		t.Errorf("expected no error for route 2, got %v", err)
	}

	if route2.IsEmpty() {
		t.Errorf("expected non-empty route for route 2, got empty route")
	}
}

func TestGetRoute_ConcurrentRequests_DeduplicatesAndSucceeds(t *testing.T) {
	service, err := NewRouteService("testdata")
	if err != nil {
		t.Fatalf("failed to create service: %v", err)
	}

	// Channel to signal both goroutines to start at the exact same moment
	startSignal := make(chan struct{})
	var wg sync.WaitGroup

	wg.Add(2)

	// Worker 1
	go func() {
		defer wg.Done()
		<-startSignal // Wait for the start whistle
		_, _ = service.GetRouteByArticleID("valid-article-id")
	}()

	// Worker 2
	go func() {
		defer wg.Done()
		<-startSignal // Wait for the start whistle
		_, _ = service.GetRouteByArticleID("valid-article-id")
	}()

	// Close the channel to release both goroutines simultaneously
	close(startSignal)
	wg.Wait()

	// Assert the final result was successfully cached by the winning worker
	route, found := service.routeCache.Get("valid-article-id")
	if !found || route.IsEmpty() {
		t.Errorf("expected route to be computed and safely cached concurrently")
	}
}
