package main

import (
	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/register", RegisterHandler).Methods("POST")
	router.HandleFunc("/login", LoginHandler).Methods("POST")
	router.HandleFunc("/chat", ChatHandler).Methods("POST")
	router.HandleFunc("/messages", GetMessagesHandler).Methods("GET")
	router.HandleFunc("/checkPhone", CheckPhoneHandler).Methods("POST")
	return router
}
