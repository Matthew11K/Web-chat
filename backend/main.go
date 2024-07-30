package main

import (
	"log"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
)

func main() {
	db := InitDB()
	defer db.Close()

	router := mux.NewRouter()

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

	router.HandleFunc("/register", RegisterHandler).Methods("POST")
	router.HandleFunc("/login", LoginHandler).Methods("POST")
	router.HandleFunc("/chat", ChatHandler).Methods("POST")
	router.HandleFunc("/messages", GetMessagesHandler).Methods("GET")

	log.Println("Server started on :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err)
	}
}
