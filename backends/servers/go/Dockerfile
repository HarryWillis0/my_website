### Build Stage
# Use the official golang image as the base image
FROM golang:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the go.mod file and download dependencies
COPY go.mod .
RUN go mod download

# Copy the server source code into the container
COPY src/ ./src/

# Build the Go application
RUN go build -o server ./src/

### Run stage
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the server binary from the previous stage
COPY --from=builder /app/server /app/server

# Copy dist folder
COPY dist ./dist

# Expose the port the server listens on
EXPOSE 3000

# Command to run the server when the container starts
CMD ["/app/server"]
