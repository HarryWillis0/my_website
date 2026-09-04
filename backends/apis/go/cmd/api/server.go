package main

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"

	"harry.willis.dev/go/articles/internal/article"
	"harry.willis.dev/go/articles/internal/route"
)

type articleStore interface {
	GetAll() []article.Article
	GetByID(id string) (article.Article, bool)
}

type viewStore interface {
	IncrementViewCount(ctx context.Context, articleID string) error
	GetViewCount(ctx context.Context, articleID string) (int64, error)
}

type routeStore interface {
	GetRouteByArticleID(articleID string) (route.Route, error)
}

type server struct {
	articles articleStore
	views    viewStore
	routes   routeStore
	logger   *slog.Logger
}

func (s *server) handleGetArticles(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.articles.GetAll())
}

func (s *server) handleGetArticleByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	art, ok := s.articles.GetByID(id)
	if !ok {
		http.NotFound(w, r)
		return
	}

	rt, err := s.routes.GetRouteByArticleID(id)
	if err != nil {
		s.logger.Error("failed to get route for article", "articleId", id, "error", err)
	}

	// A missing or failed route must render as an explicit null, not the
	// zero-value Route struct — so only attach a route when we actually have one.
	var routeResp *route.Route
	if err == nil && !rt.IsEmpty() {
		routeResp = &rt
	}

	writeJSON(w, http.StatusOK, map[string]any{"article": art, "route": routeResp})
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
