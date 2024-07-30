package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("Received user data: %+v", user)

	if err := user.Create(); err != nil {
		log.Printf("Error creating user: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var userID int
	err := db.QueryRow("SELECT id FROM users WHERE nickname = $1", user.NickName).Scan(&userID)
	if err != nil {
		log.Printf("Error getting new user ID: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "success", "user_id": userID})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := Authenticate(creds)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	token, err := GenerateJWT(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"token":   token,
		"user_id": user.ID,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func ChatHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received /chat request")
	var msg Message
	if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
		log.Printf("Error decoding message: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("Decoded message: %+v", msg)

	var userExists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id=$1)", msg.UserID).Scan(&userExists)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if !userExists {
		log.Printf("User ID %d does not exist", msg.UserID)
		http.Error(w, "User does not exist", http.StatusBadRequest)
		return
	}

	msg.DateTime = time.Now().Format(time.RFC3339)
	if err := msg.Save(); err != nil {
		log.Printf("Error saving message: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Println("Message saved successfully")
	w.WriteHeader(http.StatusCreated)
}

func GetMessagesHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, user_id, content, datetime FROM messages ORDER BY datetime ASC")
	if err != nil {
		log.Printf("Error querying messages: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		if err := rows.Scan(&msg.ID, &msg.UserID, &msg.Content, &msg.DateTime); err != nil {
			log.Printf("Error scanning message: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		messages = append(messages, msg)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error with rows: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(messages); err != nil {
		log.Printf("Error encoding messages: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
