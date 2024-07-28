package main

import (
	"database/sql"
	_ "github.com/lib/pq"
	"log"
)

var db *sql.DB

func InitDB() *sql.DB {
	connStr := "user=username dbname=chatdb sslmode=disable password=password"
	database, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err := database.Ping(); err != nil {
		log.Fatal(err)
	}

	db = database
	return db
}
