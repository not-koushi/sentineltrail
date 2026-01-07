package main

import (
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

	http.HandleFunc("/ingest", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		var logEntry AuditLog
		if err := json.NewDecoder(r.Body).Decode(&logEntry); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var prevHash sql.NullString
		database.QueryRow(
			"SELECT current_hash FROM audit_logs ORDER BY log_id DESC LIMIT 1",
		).Scan(&prevHash)

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
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})

	log.Println("Ingestion service listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}