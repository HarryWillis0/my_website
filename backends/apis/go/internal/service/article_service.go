package service

import (
	"encoding/json"
	"fmt"
	"os"
)

type ArticleService struct {
	articles []Article
}

func NewArticleService(filePath string) (*ArticleService, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("reading articles file: %w", err)
	}

	var articles []Article
	if err := json.Unmarshal(data, &articles); err != nil {
		return nil, fmt.Errorf("parsing articles JSON: %w", err)
	}

	return &ArticleService{articles: articles}, nil
}

func (s *ArticleService) GetAll() []Article {
	return s.articles
}

func (s *ArticleService) GetByID(id string) (Article, bool) {
	for _, article := range s.articles {
		if article.ID == id {
			return article, true
		}
	}
	return Article{}, false
}