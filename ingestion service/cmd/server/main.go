package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	log.Println("Ingestion service listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}