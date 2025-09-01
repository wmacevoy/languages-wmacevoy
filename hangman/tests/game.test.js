const request = require("supertest");
const app = require("../app");
const { Pool } = require("pg");

jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const pool = new Pool();

describe("Game API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Start a new game", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ word: "test" }] });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, word: "test" }] });

    const response = await request(app)
      .post("/start")
      .send({ userId: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ gameId: 1, wordLength: 4 });
  });

  test("Make a correct guess", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, word: "test", status: "active", remaining_attempts: 5 }] });
    pool.query.mockResolvedValueOnce({ rows: [] }); // No previous guesses
    pool.query.mockResolvedValueOnce({ rows: [{ guessed_letter: "t" }] });
    pool.query.mockResolvedValueOnce({ rows: [{ guessed_letter: "e" }] });

    const response = await request(app)
      .post("/guess")
      .send({ gameId: 1, letter: "t" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("active");
  });

  test("Make an incorrect guess", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, word: "test", status: "active", remaining_attempts: 5 }] });
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .post("/guess")
      .send({ gameId: 1, letter: "z" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("active");
  });
});