-- File: db/init.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  word VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'won', 'lost'
  remaining_attempts INTEGER DEFAULT 6,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_states (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id),
  guessed_letter VARCHAR(1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(50) UNIQUE NOT NULL
);

-- Optional: Add initial words to the words table
INSERT INTO words (word) VALUES ('javascript'), ('nodejs'), ('docker'), ('postgresql'), ('express');
