package main

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		log.Println("Получен токен из заголовка:", tokenString)
		if tokenString == "" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		}

		token, err := ValidateJWT(tokenString)
		if err != nil {
			log.Println("Ошибка при проверке токена:", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Извлечение claims из токена
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// Добавляем claims в контекст запроса
			ctx := context.WithValue(r.Context(), "claims", claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			log.Println("Неверный JWT токен")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		}
	})
}
