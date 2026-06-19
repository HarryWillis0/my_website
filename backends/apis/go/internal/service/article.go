package service

import "time"

type Article struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Summary   string    `json:"summary"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"created_at"`
	LastModifiedAt time.Time `json:"last_modified_at"`
}