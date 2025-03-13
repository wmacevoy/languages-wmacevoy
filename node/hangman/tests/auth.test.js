// 1️⃣ Mock `db.js` BEFORE importing `app.js`
jest.mock("../db", () => ({
    pool: {
      query: jest.fn(),
    },
  }));
  
  const { pool } = require("../db"); // Import the mocked pool
  const request = require("supertest");
  const { app } = require("../app"); // Import app AFTER mocking
  let server; // Store server instance
  
  beforeAll((done) => {
    server = app.listen(4000, () => done()); // ✅ Start test server
  });
  
  afterAll((done) => {
    server.close(done); // ✅ Properly close server after tests
  });
  
  describe("User Registration API", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Reset mocks after each test
    });
  
    test("POST /register should create a new user", async () => {
      // Mock the database response
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, username: "testuser" }],
      });
  
      const response = await request(server)
        .post("/register")
        .send({ username: "testuser" });
  
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO users (username) VALUES ($1) RETURNING *",
        ["testuser"]
      );
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, username: "testuser" });
    });
  
    test("POST /register should handle database errors", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database error"));
  
      const response = await request(server)
        .post("/register")
        .send({ username: "failuser" });
  
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO users (username) VALUES ($1) RETURNING *",
        ["failuser"]
      );
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Database error" });
    });
  });


describe("User Registration & Login API", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Reset mocks after each test
    });
  
    test("POST /register -> POST /login (Valid User)", async () => {
      // 1️⃣ Mock the `/register` database insert response
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, username: "testuser" }],
      });
  
      // 2️⃣ Call `/register`
      const registerResponse = await request(server)
        .post("/register")
        .send({ username: "testuser" });
  
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO users (username) VALUES ($1) RETURNING *",
        ["testuser"]
      );
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body).toEqual({ id: 1, username: "testuser" });
  
      // 3️⃣ Mock the `/login` database select response
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, username: "testuser" }],
      });
  
      // 4️⃣ Call `/login`
      const loginResponse = await request(server)
        .post("/login")
        .send({ username: "testuser" });
  
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE username = $1",
        ["testuser"]
      );
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toEqual({ id: 1, username: "testuser" });
    });
  
    test("POST /login (User Not Found)", async () => {
      // Mock `/login` to return an empty result
      pool.query.mockResolvedValueOnce({ rows: [] });
  
      const loginResponse = await request(server)
        .post("/login")
        .send({ username: "nonexistent" });
  
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE username = $1",
        ["nonexistent"]
      );
  
      expect(loginResponse.status).toBe(404);
      expect(loginResponse.body).toEqual({ error: "User not found" });
    });
  
    test("POST /login (Database Error)", async () => {
      // Mock database failure
      pool.query.mockRejectedValueOnce(new Error("Database error"));
  
      const loginResponse = await request(server)
        .post("/login")
        .send({ username: "testuser" });
  
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE username = $1",
        ["testuser"]
      );
  
      expect(loginResponse.status).toBe(400);
      expect(loginResponse.body).toEqual({ error: "Database error" });
    })});