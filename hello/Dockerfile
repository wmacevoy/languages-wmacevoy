# Stage 1: Build the C++ program using Alpine
FROM alpine:3 AS builder

# Install g++ and necessary build tools
RUN apk add --no-cache g++ make

# Set working directory
WORKDIR /usr/src/app

# Copy source file into container
COPY hello.cpp .

# Compile with optimization (-O2) and static linking (musl)
RUN g++ -O2 -static -o hello hello.cpp

# Stage 2: Create a minimal runtime image using Alpine
FROM alpine:3

# Set working directory
WORKDIR /app

# Copy only the compiled binary from the builder stage
COPY --from=builder /usr/src/app/hello .

# Run the compiled binary
CMD ["./hello"]
