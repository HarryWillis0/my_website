package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// build the path to dist/index.html
func getIndexFilePath() (string, error) {
	cwd, err := filepath.Abs(".")
	if err != nil {
		return "", err
	}

	indexFilePath := filepath.Join(cwd, "/dist/index.html")

	return indexFilePath, nil
}

func checkFileExists(filePath string) error {
	_, err := os.Stat(filePath)
	return err
}

// request handler
// serves requested file if it exists,
// otherwise default to index.html in order to support client side routing
func requestHandler(w http.ResponseWriter, r *http.Request) {
	const distDirPath string = "./dist"
	// static file server rooted at dist folder
	var fs http.Handler = http.FileServer(http.Dir(distDirPath))

	var requestedFile string = filepath.Join(distDirPath, filepath.Clean(r.URL.Path))

	err := checkFileExists(requestedFile)

	// check if requested file exists and if it does serve it
	if err == nil {
		fs.ServeHTTP(w, r)
		return
	}

	indexFilePath, err := getIndexFilePath()

	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// requested file does not exist, default to index.html
	http.ServeFile(w, r, indexFilePath)
}

func main() {
	http.HandleFunc("/", requestHandler)

	log.Println("Server is running on http://localhost:3000")
	http.ListenAndServe(":3000", nil)
}
