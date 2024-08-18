FROM golang:1.18-alpine

RUN apk add --no-cache git curl

WORKDIR /app

COPY backend/go.mod backend/go.sum ./

RUN go mod download

COPY backend .

COPY chat.html chat.html
COPY css/ css/
COPY imeges/ imeges/
COPY index.html index.html
COPY js/ js/
COPY personalDataEnterAcc.html personalDataEnterAcc.html
COPY personalDataNewAcc.html personalDataNewAcc.html

RUN go build -o main .

CMD ["./main"]
