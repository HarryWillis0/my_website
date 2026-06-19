package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	
	mux := http.NewServeMux()

	mux.HandleFunc("GET /articles", handleGetArticles)
	mux.HandleFunc("GET /articles/{id}", handleGetArticleByID)
 
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	logger.Info("server starting", "addr", addr)
 
	if err := http.ListenAndServe(addr, mux); err != nil {
		logger.Error("server failed", "error", err)
		os.Exit(1)
	}
}

func handleGetArticles(w http.ResponseWriter, r *http.Request) {
	data := []map[string]string{
		{"id": "1", "title": "Getting Started with Go"},
		{"id": "2", "title": "Understanding Interfaces"},
	}
	writeJSON(w, http.StatusOK, data)
}

func handleGetArticleByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
 
	data := map[string]string{"id": id, "title": "Placeholder article"}
	writeJSON(w, http.StatusOK, data)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}