package main

import (
	"log/slog"
	"net/http"
	"os"

	"harry.willis.dev/go/articles/internal/service"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	svc, err := service.NewArticleService("data/articles.json")
	if err != nil {
		logger.Error("failed to load articles", "error", err)
		os.Exit(1)
	}

	srv := &server{articles: svc}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /articles", srv.handleGetArticles)
	mux.HandleFunc("GET /articles/{id}", srv.handleGetArticleByID)

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
