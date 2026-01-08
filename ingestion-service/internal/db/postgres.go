package db

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

func Connect() (*sql.DB, error) {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nill {
		return nil, err
	}

	// Force connection validation
	if err := db.Ping(); err != nil {
		return nil,err
	}

	return db, nil
}