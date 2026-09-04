package article

type Article struct {
	ID             string `json:"id"`
	Title          string `json:"title"`
	Summary        string `json:"summary"`
	Body           string `json:"body"`
	Created        string `json:"created"`
	LastModifiedAt string `json:"lastModifiedAt"`
}
