package main

import (
	"encoding/json"
	"net/http"

	"harry.willis.dev/go/articles/internal/service"
)

type articleStore interface {
	GetAll() []service.Article
	GetByID(id string) (service.Article, bool)
}

type server struct {
	articles articleStore
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

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
