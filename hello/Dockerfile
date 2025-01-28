# Use Alpine Linux as the base image
FROM alpine:3

# Install gcc, g++, and make, along with required libraries
RUN apk add --no-cache gcc g++ make libc-dev

# Set the working directory inside the container
WORKDIR /app

# Copy the C++ source code to the container
COPY hello.cpp .

# Compile the C++ program
RUN g++ -o hello.exe hello.cpp

# Command to run the compiled program
CMD ["./hello.exe"]
