FROM golang:latest AS builder

WORKDIR /app

COPY go.mod .
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o api ./cmd/api/

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/api .
COPY --from=builder /app/data ./data

EXPOSE 8080

CMD ["./api"]
