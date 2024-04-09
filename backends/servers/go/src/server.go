package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// build the path to dist/index.html
func getIndexFilePath() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}

	absolutePath := filepath.Join(dir, "dist", "index.html")

	return absolutePath, nil
}

// check if a file exists by its path
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
	// get the port from the environment variable, defaulting to 3000 if not set
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.HandleFunc("/", requestHandler)

	log.Println("Server is listening on " + port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
