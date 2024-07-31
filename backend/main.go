package main

import (
	"log"
	"net/http"
	"path/filepath"
)

func main() {
	db := InitDB()
	defer db.Close()

	router := NewRouter()

	staticFileDirectory := http.Dir("./")
	staticFileHandler := http.StripPrefix("/", http.FileServer(staticFileDirectory))
	router.PathPrefix("/css/").Handler(staticFileHandler).Methods("GET")
	router.PathPrefix("/js/").Handler(staticFileHandler).Methods("GET")
	router.PathPrefix("/imeges/").Handler(staticFileHandler).Methods("GET")

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Serving index.html")
		http.ServeFile(w, r, filepath.Join("./", "index.html"))
	}).Methods("GET")
	router.HandleFunc("/chat.html", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Serving chat.html")
		http.ServeFile(w, r, filepath.Join("./", "chat.html"))
	}).Methods("GET")
	router.HandleFunc("/personalDataEnterAcc.html", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Serving personalDataEnterAcc.html")
		http.ServeFile(w, r, filepath.Join("./", "personalDataEnterAcc.html"))
	}).Methods("GET")
	router.HandleFunc("/personalDataNewAcc.html", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Serving personalDataNewAcc.html")
		http.ServeFile(w, r, filepath.Join("./", "personalDataNewAcc.html"))
	}).Methods("GET")

	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Serving static file: %s", r.URL.Path)
		http.ServeFile(w, r, filepath.Join("./", r.URL.Path))
	})

	log.Println("Server started on :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err)
	}
}
