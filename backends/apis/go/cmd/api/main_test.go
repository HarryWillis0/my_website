package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetArticles(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/articles", nil)
	w := httptest.NewRecorder()

	handleGetArticles(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}
	if ct := w.Header().Get("Content-Type"); ct != "application/json" {
		t.Errorf("expected Content-Type application/json, got %s", ct)
	}
}

func TestGetArticleByID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/articles/1", nil)
	req.SetPathValue("id", "1")
	w := httptest.NewRecorder()

	handleGetArticleByID(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}
	if ct := w.Header().Get("Content-Type"); ct != "application/json" {
		t.Errorf("expected Content-Type application/json, got %s", ct)
	}
}
