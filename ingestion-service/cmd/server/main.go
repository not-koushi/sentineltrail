package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

type AuditRequest struct {
	ServiceID string          `json:"service_id"`
	EventType string          `json:"event_type"`
	ActorID   string          `json:"actor_id"`
	Payload   json.RawMessage `json:"payload"`
}

func computeHash(input string) string {
	hash := sha256.Sum256([]byte(input))
	return hex.EncodeToString(hash[:])
}

func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	http.HandleFunc("/ingest", func(w http.ResponseWriter, r *http.Request) {
		var req AuditRequest

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid json", http.StatusBadRequest)
			return
		}

		// Fetch previous hash
		var previousHash sql.NullString
		err := db.QueryRow(`
			SELECT current_hash
			FROM audit_logs
			ORDER BY log_id DESC
			LIMIT 1
		`).Scan(&previousHash)

		if err != nil && err != sql.ErrNoRows {
			http.Error(w, "failed to read previous hash", http.StatusInternalServerError)
			return
		}

		// Canonical hash input (THIS IS THE KEY FIX)
		hashInput := string(req.Payload)
		if previousHash.Valid {
			hashInput = hashInput + previousHash.String
		}

		currentHash := computeHash(hashInput)

		_, err = db.Exec(`
			INSERT INTO audit_logs
			(service_id, event_type, actor_id, payload, hash_input, previous_hash, current_hash)
			VALUES ($1,$2,$3,$4,$5,$6,$7)
		`,
			req.ServiceID,
			req.EventType,
			req.ActorID,
			req.Payload,
			hashInput,
			previousHash,
			currentHash,
		)

		if err != nil {
			log.Println("DB INSERT ERROR:", err)
			http.Error(w, "failed to insert log", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})

	log.Println("Ingestion service listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}