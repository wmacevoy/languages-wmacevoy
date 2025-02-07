// File: public/script.js

let userId = null; // To store the registered/logged-in user ID
let gameId = null; // To store the current game ID
const maxAttempts = 6; // Maximum number of incorrect attempts allowed

// Register a new user
async function registerUser() {
  const username = document.getElementById('register-username').value;
  if (!username) return alert('Username cannot be empty!');

  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  const data = await response.json();

  if (response.ok) {
    userId = data.id;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('game-controls').style.display = 'block';
  } else {
    alert(data.error);
  }
}

// Login an existing user
async function loginUser() {
  const username = document.getElementById('login-username').value;
  if (!username) return alert('Username cannot be empty!');

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  const data = await response.json();

  if (response.ok) {
    userId = data.id;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('game-controls').style.display = 'block';
  } else {
    alert(data.error);
  }
}

// Start a new game
async function startGame() {
  if (!userId) return alert('Please register or login first!');

  const response = await fetch('/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();

  if (response.ok) {
    gameId = data.gameId;
    displayGameState();
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
  } else {
    alert(data.error);
  }
}

// Display the current state of the game
async function displayGameState() {
  const response = await fetch(`/state?gameId=${gameId}`);
  const data = await response.json();

  if (response.ok) {
    document.getElementById('word-state').textContent = data.wordState;
    document.getElementById('guessed-letters').textContent = data.guessedLetters.join(', ') || '-';
    document.getElementById('remaining-attempts').textContent = data.remainingAttempts;
    updateHangmanImage(data.remainingAttempts);
  } else {
    alert(data.error);
  }
}

// Update the hangman image based on the remaining attempts
function updateHangmanImage(remainingAttempts) {
  const attemptsUsed = maxAttempts - remainingAttempts;
  const hangmanImage = document.getElementById('hangman-image');
  hangmanImage.src = `hangman${attemptsUsed}.svg`; // Update image based on wrong guesses
}

// Make a letter guess
async function makeGuess() {
  const letter = document.getElementById('letter-input').value;
  if (!letter || letter.length !== 1) return alert('Please enter a single letter!');

  const response = await fetch('/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, letter }),
  });
  const data = await response.json();

  if (response.ok) {
    displayGameState();
    if (data.status === 'won' || data.status === 'lost') {
      document.getElementById('result-section').style.display = 'block';
      document.getElementById('result-message').textContent = `You ${data.status}! The word was: ${data.word}`;
      document.getElementById('game-section').style.display = 'none';
    }
  } else {
    alert(data.error);
  }
}

// Reset the game
function resetGame() {
  document.getElementById('result-section').style.display = 'none';
  document.getElementById('game-section').style.display = 'none';
  document.getElementById('game-controls').style.display = 'block';
  gameId = null;
  updateHangmanImage(maxAttempts); // Reset hangman image
}
