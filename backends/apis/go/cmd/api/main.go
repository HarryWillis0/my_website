package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"cloud.google.com/go/firestore"
	"harry.willis.dev/go/articles/internal/service"
)

func registerRoutes(mux *http.ServeMux, srv *server) {
	mux.HandleFunc("GET /articles", srv.handleGetArticles)
	mux.HandleFunc("GET /articles/{id}", srv.handleGetArticleByID)
	mux.HandleFunc("POST /articles/{id}/views", srv.handleIncrementViewCount)
	mux.HandleFunc("GET /articles/{id}/views", srv.handleGetViewCount)
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	svc, err := service.NewArticleService("data/articles.json")
	if err != nil {
		logger.Error("failed to load articles", "error", err)
		os.Exit(1)
	}

	views, err := newFirestoreViewStore(context.Background(), firestore.DetectProjectID)
	if err != nil {
		logger.Error("failed to create view store", "error", err)
		os.Exit(1)
	}

	srv := &server{articles: svc, views: views}

	mux := http.NewServeMux()
	registerRoutes(mux, srv)

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
