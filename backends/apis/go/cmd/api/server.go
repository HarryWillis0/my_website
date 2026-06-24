package main

import (
	"context"
	"encoding/json"
	"net/http"

	"harry.willis.dev/go/articles/internal/service"
)

type articleStore interface {
	GetAll() []service.Article
	GetByID(id string) (service.Article, bool)
}

type viewStore interface {
	IncrementViewCount(ctx context.Context, articleID string) error
	GetViewCount(ctx context.Context, articleID string) (int64, error)
}

type server struct {
	articles articleStore
	views    viewStore
}

func (s *server) handleGetArticles(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.articles.GetAll())
}

func (s *server) handleGetArticleByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	article, ok := s.articles.GetByID(id)
	if !ok {
		http.NotFound(w, r)
		return
	}
	writeJSON(w, http.StatusOK, article)
}

func (s *server) handleIncrementViewCount(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := s.views.IncrementViewCount(r.Context(), id); err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (s *server) handleGetViewCount(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	count, err := s.views.GetViewCount(r.Context(), id)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"viewCount": count})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
