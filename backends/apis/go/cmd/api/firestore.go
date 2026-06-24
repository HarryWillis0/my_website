package main

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type firestoreViewStore struct {
	client *firestore.Client
}

func newFirestoreViewStore(ctx context.Context, projectID string) (*firestoreViewStore, error) {
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return &firestoreViewStore{client: client}, nil
}

func (s *firestoreViewStore) IncrementViewCount(ctx context.Context, articleID string) error {
	ref := s.client.Collection("view_counts").Doc(articleID)
	_, err := ref.Set(ctx, map[string]any{
		"count": firestore.Increment(1),
	}, firestore.MergeAll)
	return err
}

func (s *firestoreViewStore) GetViewCount(ctx context.Context, articleID string) (int64, error) {
	ref := s.client.Collection("view_counts").Doc(articleID)
	doc, err := ref.Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return 0, nil
		}
		return 0, err
	}
	count, err := doc.DataAt("count")
	if err != nil {
		return 0, fmt.Errorf("reading count field: %w", err)
	}
	switch v := count.(type) {
	case int64:
		return v, nil
	case float64:
		return int64(v), nil
	default:
		return 0, fmt.Errorf("unexpected type for count field: %T", v)
	}
}
