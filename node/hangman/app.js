// File: app.js

const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Utility function to get a random word from the database
const getRandomWord = async () => {
  const result = await pool.query('SELECT word FROM words ORDER BY RANDOM() LIMIT 1');
  return result.rows.length > 0 ? result.rows[0].word : 'default';
};

// -------------- ROUTES --------------

// Register a new user
app.post('/register', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (username) VALUES ($1) RETURNING *', [username]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login an existing user
app.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start a new game
app.post('/start', async (req, res) => {
  const { userId } = req.body;
  try {
    const word = await getRandomWord();
    const result = await pool.query('INSERT INTO games (user_id, word) VALUES ($1, $2) RETURNING *', [userId, word]);
    res.status(201).json({ gameId: result.rows[0].id, wordLength: word.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit a letter guess
app.post('/guess', async (req, res) => {
  const { gameId, letter } = req.body;
  try {
    // Check if the game exists and is active
    const gameResult = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    const game = gameResult.rows[0];
    if (game.status !== 'active') {
      return res.status(400).json({ error: `Game is ${game.status}` });
    }

    // Check if the letter was already guessed
    const guessResult = await pool.query('SELECT * FROM game_states WHERE game_id = $1 AND guessed_letter = $2', [gameId, letter]);
    if (guessResult.rows.length > 0) {
      return res.status(400).json({ error: 'Letter already guessed' });
    }

    // Add the guess to the game state
    await pool.query('INSERT INTO game_states (game_id, guessed_letter) VALUES ($1, $2)', [gameId, letter]);

    // Check if the letter is in the word
    const isLetterInWord = game.word.includes(letter);
    if (!isLetterInWord) {
      // If the guess is incorrect, decrement remaining attempts
      await pool.query('UPDATE games SET remaining_attempts = remaining_attempts - 1 WHERE id = $1', [gameId]);
    }

    // Update game status if necessary
    const updatedGameResult = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    const updatedGame = updatedGameResult.rows[0];
    if (updatedGame.remaining_attempts <= 0) {
      await pool.query('UPDATE games SET status = $1 WHERE id = $2', ['lost', gameId]);
      return res.json({ status: 'lost', word: game.word });
    }

    // Check if the user has won
    const guessedLettersResult = await pool.query('SELECT guessed_letter FROM game_states WHERE game_id = $1', [gameId]);
    const guessedLetters = guessedLettersResult.rows.map(row => row.guessed_letter);
    const uniqueLettersInWord = new Set(game.word);

    if ([...uniqueLettersInWord].every(letter => guessedLetters.includes(letter))) {
      await pool.query('UPDATE games SET status = $1 WHERE id = $2', ['won', gameId]);
      return res.json({ status: 'won', word: game.word });
    }

    res.json({ status: 'active', remainingAttempts: updatedGame.remaining_attempts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get the current game state
app.get('/state', async (req, res) => {
  const { gameId } = req.query;
  try {
    const gameResult = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = gameResult.rows[0];
    const guessedLettersResult = await pool.query('SELECT guessed_letter FROM game_states WHERE game_id = $1', [gameId]);
    const guessedLetters = guessedLettersResult.rows.map(row => row.guessed_letter);

    const wordState = game.word.split('').map(letter => (guessedLetters.includes(letter) ? letter : '_')).join('');

    res.json({ wordState, guessedLetters, remainingAttempts: game.remaining_attempts, status: game.status });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Get all words
app.get('/admin/words', async (req, res) => {
  try {
    const result = await pool.query('SELECT word FROM words');
    const words = result.rows.map(row => row.word);
    res.json(words);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Set words
app.post('/admin/words', async (req, res) => {
  const { words } = req.body; // Expects an array of words
  try {
    await pool.query('TRUNCATE TABLE words');
    const insertValues = words.map(word => `('${word}')`).join(', ');
    await pool.query(`INSERT INTO words (word) VALUES ${insertValues}`);
    res.status(201).json({ message: 'Words updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Serve the frontend for any other routes not defined above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
