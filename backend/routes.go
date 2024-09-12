package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func NewRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/register", RegisterHandler).Methods("POST")
	router.HandleFunc("/login", LoginHandler).Methods("POST")
	router.HandleFunc("/checkPhone", CheckPhoneHandler).Methods("POST")
	router.Handle("/chat", AuthMiddleware(http.HandlerFunc(ChatHandler))).Methods("POST")
	router.Handle("/messages", AuthMiddleware(http.HandlerFunc(GetMessagesHandler))).Methods("GET")
	router.Handle("/upload", AuthMiddleware(http.HandlerFunc(FileUploadHandler))).Methods("POST")

	return router
}
