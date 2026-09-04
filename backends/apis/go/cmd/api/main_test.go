package main

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"

	"harry.willis.dev/go/articles/internal/article"
	"harry.willis.dev/go/articles/internal/route"
)

type fakeViewStore struct {
	mu     sync.Mutex
	counts map[string]int64
}

func (f *fakeViewStore) IncrementViewCount(_ context.Context, articleID string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.counts == nil {
		f.counts = make(map[string]int64)
	}
	f.counts[articleID]++
	return nil
}

func (f *fakeViewStore) GetViewCount(_ context.Context, articleID string) (int64, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	return f.counts[articleID], nil
}

// fakeRouteStore returns whatever route/err it's configured with, regardless
// of articleID — tests set the fields directly to drive success/failure paths.
type fakeRouteStore struct {
	route route.Route
	err   error
}

func (f *fakeRouteStore) GetRouteByArticleID(_ string) (route.Route, error) {
	return f.route, f.err
}

func newTestServer(t *testing.T) *server {
	t.Helper()
	svc, err := article.NewArticleService("testdata/articles.json")
	if err != nil {
		t.Fatalf("failed to load test articles: %v", err)
	}
	return &server{
		articles: svc,
		views:    &fakeViewStore{},
		routes:   &fakeRouteStore{},
		logger:   slog.New(slog.NewTextHandler(io.Discard, nil)),
	}
}

func TestGetArticles_ReturnsIArticleShape(t *testing.T) {
	srv := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/articles", nil)
	w := httptest.NewRecorder()
	srv.handleGetArticles(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var articles []map[string]any
	if err := json.NewDecoder(w.Body).Decode(&articles); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if len(articles) == 0 {
		t.Fatal("expected at least one article")
	}

	for _, field := range []string{"id", "title", "summary", "body", "created", "lastModifiedAt"} {
		if _, ok := articles[0][field]; !ok {
			t.Errorf("missing field %q in response", field)
		}
	}
}

func TestGetArticleByID_ReturnsArticle(t *testing.T) {
	srv := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/articles/test-1", nil)
	req.SetPathValue("id", "test-1")
	w := httptest.NewRecorder()
	srv.handleGetArticleByID(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var body map[string]any
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}

	articleField, ok := body["article"].(map[string]any)
	if !ok {
		t.Fatalf("expected article object in response, got %v", body["article"])
	}
	if articleField["id"] != "test-1" {
		t.Errorf("expected id %q, got %v", "test-1", articleField["id"])
	}
}

func TestGetArticleByID_RouteFound_IncludesRouteInResponse(t *testing.T) {
	srv := newTestServer(t)
	srv.routes = &fakeRouteStore{
		route: route.Route{
			Points:        []route.RoutePoint{{Lat: 1, Lon: 2, Ele: 3, Distance: 4}},
			Distance:      4,
			ElevationGain: 3,
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/articles/test-1", nil)
	req.SetPathValue("id", "test-1")
	w := httptest.NewRecorder()
	srv.handleGetArticleByID(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var body map[string]any
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}

	routeField, ok := body["route"].(map[string]any)
	if !ok {
		t.Fatalf("expected route object in response, got %v", body["route"])
	}
	if routeField["distance"] != 4.0 {
		t.Errorf("expected distance 4, got %v", routeField["distance"])
	}
}

func TestGetArticleByID_RouteLookupFails_ReturnsArticleWithNullRoute(t *testing.T) {
	srv := newTestServer(t)
	srv.routes = &fakeRouteStore{err: errors.New("boom")}

	req := httptest.NewRequest(http.MethodGet, "/articles/test-1", nil)
	req.SetPathValue("id", "test-1")
	w := httptest.NewRecorder()
	srv.handleGetArticleByID(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 even when route lookup fails, got %d", w.Code)
	}

	var body map[string]any
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}

	if body["route"] != nil {
		t.Errorf("expected route to be null on lookup failure, got %v", body["route"])
	}

	articleField, ok := body["article"].(map[string]any)
	if !ok {
		t.Fatalf("expected article object in response, got %v", body["article"])
	}
	if articleField["id"] != "test-1" {
		t.Errorf("expected article id %q, got %v", "test-1", articleField["id"])
	}
}

func TestGetArticleByID_Returns404ForUnknownID(t *testing.T) {
	srv := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/articles/does-not-exist", nil)
	req.SetPathValue("id", "does-not-exist")
	w := httptest.NewRecorder()
	srv.handleGetArticleByID(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", w.Code)
	}
}

func TestIncrementViewCount_ReturnsOK(t *testing.T) {
	srv := newTestServer(t)

	req := httptest.NewRequest(http.MethodPost, "/articles/test-1/views", nil)
	req.SetPathValue("id", "test-1")
	w := httptest.NewRecorder()
	srv.handleIncrementViewCount(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}

func TestGetViewCount_ReturnsZeroForNewArticle(t *testing.T) {
	srv := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/articles/never-seen/views", nil)
	req.SetPathValue("id", "never-seen")
	w := httptest.NewRecorder()
	srv.handleGetViewCount(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var result map[string]any
	if err := json.NewDecoder(w.Body).Decode(&result); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if result["viewCount"] != float64(0) {
		t.Errorf("expected viewCount 0, got %v", result["viewCount"])
	}
}

func TestGetViewCount_ReturnsCountAfterIncrement(t *testing.T) {
	srv := newTestServer(t)

	for range 3 {
		req := httptest.NewRequest(http.MethodPost, "/articles/test-1/views", nil)
		req.SetPathValue("id", "test-1")
		srv.handleIncrementViewCount(httptest.NewRecorder(), req)
	}

	req := httptest.NewRequest(http.MethodGet, "/articles/test-1/views", nil)
	req.SetPathValue("id", "test-1")
	w := httptest.NewRecorder()
	srv.handleGetViewCount(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var result map[string]any
	if err := json.NewDecoder(w.Body).Decode(&result); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if result["viewCount"] != float64(3) {
		t.Errorf("expected viewCount 3, got %v", result["viewCount"])
	}
}
