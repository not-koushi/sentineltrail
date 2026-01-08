package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"sentineltrail/ingestion/internal/db"
	"sentineltrail/ingestion/internal/hashing"
)

type AuditLog struct {
	ServiceID string          `json:"service_id"`
	EventType string          `json:"event_type"`
	ActorID   string          `json:"actor_id"`
	Payload   json.RawMessage `json:"payload"`
}

func main() {
	database, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	http.HandleFunc("/ingest", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		var logEntry AuditLog
		if err := json.NewDecoder(r.Body).Decode(&logEntry); err != nil {
			http.Error(w, "invalid json", http.StatusBadRequest)
			return
		}

		var prevHash sql.NullString
		err = database.QueryRow(
			"SELECT current_hash FROM audit_logs ORDER BY log_id DESC LIMIT 1",
		).Scan(&prevHash)

		if err != nil && err != sql.ErrNoRows {
			http.Error(w, "failed to read previous hash", http.StatusInternalServerError)
			return
		}

		if err == sql.ErrNoRows {
			prevHash = sql.NullString{Valid: false}
		}

		currentHash := hashing.ComputeHash(logEntry.Payload, prevHash.String)

		_, err = database.Exec(`
			INSERT INTO audit_logs
			(service_id, event_type, actor_id, payload, previous_hash, current_hash)
			VALUES ($1,$2,$3,$4,$5,$6)
		`,
			logEntry.ServiceID,
			logEntry.EventType,
			logEntry.ActorID,
			logEntry.Payload,
			prevHash.String,
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