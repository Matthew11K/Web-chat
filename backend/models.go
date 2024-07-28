package main

import (
	"database/sql"
	"errors"
	"log"
)

type User struct {
	ID       int    `json:"id"`
	Surname  string `json:"surname"`
	Name     string `json:"name"`
	NickName string `json:"nickname"`
	Password string `json:"password"`
}

type Credentials struct {
	NickName string `json:"nickname"`
	Password string `json:"password"`
}

type Message struct {
	ID       int    `json:"id"`
	UserID   int    `json:"user_id"`
	Content  string `json:"content"`
	DateTime string `json:"datetime"`
}

func (u *User) Create() error {
	hashedPassword, err := HashPassword(u.Password)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return err
	}

	log.Printf("Inserting user into database: %+v", u)
	_, err = db.Exec("INSERT INTO users (surname, name, nickname, password) VALUES ($1, $2, $3, $4)", u.Surname, u.Name, u.NickName, hashedPassword)
	if err != nil {
		log.Printf("Error executing insert: %v", err)
		return err
	}
	return nil
}

func Authenticate(creds Credentials) (*User, error) {
	var user User
	row := db.QueryRow("SELECT id, surname, name, nickname, password FROM users WHERE nickname = $1", creds.NickName)
	if err := row.Scan(&user.ID, &user.Surname, &user.Name, &user.NickName, &user.Password); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	if err := CheckPasswordHash(creds.Password, user.Password); err != nil {
		return nil, errors.New("invalid credentials")
	}

	return &user, nil
}

func (m *Message) Save() error {
	_, err := db.Exec("INSERT INTO messages (user_id, content, datetime) VALUES ($1, $2, $3)", m.UserID, m.Content, m.DateTime)
	return err
}
