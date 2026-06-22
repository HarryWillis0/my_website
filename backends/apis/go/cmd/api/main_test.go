package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"harry.willis.dev/go/articles/internal/service"
)

func newTestServer(t *testing.T) *server {
	t.Helper()
	svc, err := service.NewArticleService("testdata/articles.json")
	if err != nil {
		t.Fatalf("failed to load test articles: %v", err)
	}
	return &server{articles: svc}
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

	var article map[string]any
	if err := json.NewDecoder(w.Body).Decode(&article); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if article["id"] != "test-1" {
		t.Errorf("expected id %q, got %v", "test-1", article["id"])
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
