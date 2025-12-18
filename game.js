// Game State
let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timer: 0,               // Displayed seconds
    startTime: null,        // Real timestamp when game starts
    timerInterval: null,    // For UI refresh only
    hintsRemaining: 3,
    isProcessing: false
};

// Cat types
const catTypes = [
    '🐱', '😺', '😸', '😹',
    '😻', '😼', '🙀', '😾'
];

// Initialize game
document.addEventListener('DOMContentLoaded', function () {
    // Only initialize if we're on the game page
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
        initializeGame();
    }
});

// Initialize/Reset game
function initializeGame() {
    stopTimer();

    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.timer = 0;
    gameState.startTime = null;
    gameState.timerInterval = null;
    gameState.hintsRemaining = 3;
    gameState.isProcessing = false;

    const pairs = [...catTypes, ...catTypes];
    gameState.cards = shuffleArray(pairs);

    renderGameBoard();
    updateStats();
    updateTimerDisplay();
}

// Shuffle array
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Render board
function renderGameBoard() {
    const board = document.getElementById('game-board');
    if (!board) return;
    
    // Clear existing content and remove all event listeners
    board.innerHTML = '';

    // Create all cards
    gameState.cards.forEach((emoji, index) => {
        const card = createCard(emoji, index);
        board.appendChild(card);
    });
}

// Create card
function createCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;

    card.innerHTML = `
        <div class="card-front">?</div>
        <div class="card-back">${emoji}</div>
    `;

    card.addEventListener('click', () => handleCardClick(index));

    return card;
}

// Audio for card clicks
const clickSound = new Audio('assets/click.mp3');

// Handle click
function handleCardClick(index) {
    if (gameState.isProcessing) return;

    const card = document.querySelector(`[data-index="${index}"]`);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    // Play click sound
    clickSound.currentTime = 0; // Reset to start for rapid clicks
    clickSound.play().catch(e => {
        // Ignore audio play errors (e.g., user hasn't interacted with page yet)
        console.log('Audio play failed:', e);
    });

    // Start real timer on first move
    if (gameState.startTime === null) {
        startTimer();
    }

    card.classList.add('flipped');
    gameState.flippedCards.push({
        index,
        emoji: card.dataset.emoji,
        element: card
    });

    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateStats();
        checkForMatch();
    }
}

// Match logic
function checkForMatch() {
    gameState.isProcessing = true;
    const [c1, c2] = gameState.flippedCards;

    if (c1.emoji === c2.emoji) {
        setTimeout(() => {
            c1.element.classList.add('matched', 'pulse');
            c2.element.classList.add('matched', 'pulse');

            gameState.matchedPairs++;
            gameState.flippedCards = [];
            gameState.isProcessing = false;

            updateStats();

            if (gameState.matchedPairs === catTypes.length) {
                setTimeout(showWinModal, 300);
            }
        }, 300);

    } else {
        setTimeout(() => {
            c1.element.classList.remove('flipped');
            c2.element.classList.remove('flipped');

            c1.element.classList.add('shake');
            c2.element.classList.add('shake');

            setTimeout(() => {
                c1.element.classList.remove('shake');
                c2.element.classList.remove('shake');
            }, 400);

            gameState.flippedCards = [];
            gameState.isProcessing = false;

        }, 900);
    }
}

// Start timer (real clock-based)
function startTimer() {
    // Safety check: only start once per game session
    if (gameState.startTime !== null || gameState.timerInterval !== null) {
        return; // Timer already running, don't start again
    }

    // Initialize timer state
    gameState.startTime = Date.now();
    gameState.timer = 0;
    updateTimerDisplay(); // Show 0:00 immediately

    // Interval only updates UI; real time comes from Date.now()
    gameState.timerInterval = setInterval(() => {
        const now = Date.now();
        gameState.timer = Math.floor((now - gameState.startTime) / 1000);
        updateTimerDisplay();
    }, 200);
}

// Stop timer
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    gameState.startTime = null;
    gameState.timer = 0; // Reset displayed time
}

// Update timer display
function updateTimerDisplay() {
    const m = Math.floor(gameState.timer / 60);
    const s = gameState.timer % 60;

    document.getElementById('timer').textContent =
        `${m}:${s.toString().padStart(2, '0')}`;
}

// Update stats
function updateStats() {
    document.getElementById('moves').textContent = gameState.moves;
    document.getElementById('matches').textContent =
        `${gameState.matchedPairs} / ${catTypes.length}`;

    const btn = document.getElementById('hint-btn');
    if (gameState.hintsRemaining > 0) {
        btn.textContent = `Hint (${gameState.hintsRemaining})`;
        btn.disabled = false;
    } else {
        btn.textContent = 'No Hints';
        btn.disabled = true;
    }
}

// Hint logic
function showHint() {
    if (gameState.hintsRemaining <= 0 || gameState.isProcessing) return;

    const unmatched = document.querySelectorAll('.game-card:not(.matched)');
    const map = {};

    unmatched.forEach(card => {
        const emoji = card.dataset.emoji;
        if (!map[emoji]) map[emoji] = [];
        map[emoji].push(card);
    });

    for (let emoji in map) {
        if (map[emoji].length === 2) {
            const [a, b] = map[emoji];
            a.classList.add('pulse');
            b.classList.add('pulse');

            setTimeout(() => {
                a.classList.remove('pulse');
                b.classList.remove('pulse');
            }, 900);

            gameState.hintsRemaining--;
            updateStats();
            break;
        }
    }
}

// Show win modal
function showWinModal() {
    // Calculate final time
    let finalTime = gameState.timer;
    
    // If timer is still running, calculate from startTime for accuracy
    if (gameState.startTime !== null) {
        finalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    }
    
    const m = Math.floor(finalTime / 60);
    const s = finalTime % 60;

    document.getElementById('final-time').textContent =
        `${m}:${s.toString().padStart(2, '0')}`;

    document.getElementById('final-moves').textContent = gameState.moves;

    stopTimer();

    document.getElementById('win-modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('win-modal').classList.remove('active');
    resetGame();
}

// Reset
function resetGame() {
    initializeGame();
}

// Click outside modal to close
document.addEventListener('click', function (e) {
    const modal = document.getElementById('win-modal');
    if (e.target === modal) closeModal();
});