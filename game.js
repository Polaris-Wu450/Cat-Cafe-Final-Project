// Game State
let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timer: 0,
    timerInterval: null,
    hintsRemaining: 3,
    isProcessing: false
};

// Cat emojis for the game
const catEmojis = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿'];

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    updateCartCount();
});

// Initialize/Reset game
function initializeGame() {
    // Reset game state
    gameState = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        timer: 0,
        timerInterval: null,
        hintsRemaining: 3,
        isProcessing: false
    };

    // Clear timer if exists
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    // Create card pairs
    const cardPairs = [...catEmojis, ...catEmojis];
    gameState.cards = shuffleArray(cardPairs);

    // Render game board
    renderGameBoard();

    // Update UI
    updateStats();
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render game board
function renderGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    gameState.cards.forEach((emoji, index) => {
        const card = createCard(emoji, index);
        gameBoard.appendChild(card);
    });
}

// Create card element
function createCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;

    card.innerHTML = `
        <div class="card-front">🐱</div>
        <div class="card-back">${emoji}</div>
    `;

    card.addEventListener('click', () => handleCardClick(index));

    return card;
}

// Handle card click
function handleCardClick(index) {
    // Ignore if processing or card already flipped/matched
    if (gameState.isProcessing) return;
    
    const card = document.querySelector(`[data-index="${index}"]`);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    // Start timer on first move
    if (gameState.moves === 0) {
        startTimer();
    }

    // Flip card
    card.classList.add('flipped');
    gameState.flippedCards.push({index, emoji: card.dataset.emoji, element: card});

    // Check for match when two cards are flipped
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateStats();
        checkForMatch();
    }
}

// Check for match
function checkForMatch() {
    gameState.isProcessing = true;
    const [card1, card2] = gameState.flippedCards;

    if (card1.emoji === card2.emoji) {
        // Match found!
        setTimeout(() => {
            card1.element.classList.add('matched', 'pulse');
            card2.element.classList.add('matched', 'pulse');
            gameState.matchedPairs++;
            gameState.flippedCards = [];
            gameState.isProcessing = false;
            updateStats();

            // Check if game is won
            if (gameState.matchedPairs === catEmojis.length) {
                setTimeout(showWinModal, 500);
            }
        }, 500);
    } else {
        // No match
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.element.classList.add('shake');
            card2.element.classList.add('shake');
            
            setTimeout(() => {
                card1.element.classList.remove('shake');
                card2.element.classList.remove('shake');
            }, 500);
            
            gameState.flippedCards = [];
            gameState.isProcessing = false;
        }, 1000);
    }
}

// Start timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        updateTimerDisplay();
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update stats display
function updateStats() {
    document.getElementById('moves').textContent = gameState.moves;
    document.getElementById('matches').textContent = 
        `${gameState.matchedPairs} / ${catEmojis.length}`;
    
    // Update hint button
    const hintBtn = document.getElementById('hint-btn');
    if (gameState.hintsRemaining > 0) {
        hintBtn.textContent = `💡 Hint (${gameState.hintsRemaining})`;
        hintBtn.disabled = false;
    } else {
        hintBtn.textContent = '💡 No Hints';
        hintBtn.disabled = true;
    }
}

// Show hint
function showHint() {
    if (gameState.hintsRemaining <= 0 || gameState.isProcessing) return;

    // Find an unmatched pair
    const unmatchedCards = document.querySelectorAll('.game-card:not(.matched)');
    const cardsByEmoji = {};

    unmatchedCards.forEach(card => {
        const emoji = card.dataset.emoji;
        if (!cardsByEmoji[emoji]) {
            cardsByEmoji[emoji] = [];
        }
        cardsByEmoji[emoji].push(card);
    });

    // Find a pair
    for (let emoji in cardsByEmoji) {
        if (cardsByEmoji[emoji].length === 2) {
            const [card1, card2] = cardsByEmoji[emoji];
            
            // Briefly show the pair
            card1.classList.add('pulse');
            card2.classList.add('pulse');
            
            setTimeout(() => {
                card1.classList.remove('pulse');
                card2.classList.remove('pulse');
            }, 1000);
            
            gameState.hintsRemaining--;
            updateStats();
            break;
        }
    }
}

// Show win modal
function showWinModal() {
    clearInterval(gameState.timerInterval);
    
    const modal = document.getElementById('win-modal');
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('final-time').textContent = timeStr;
    document.getElementById('final-moves').textContent = gameState.moves;
    
    modal.classList.add('active');
}

// Close modal and reset game
function closeModal() {
    const modal = document.getElementById('win-modal');
    modal.classList.remove('active');
    resetGame();
}

// Reset game
function resetGame() {
    initializeGame();
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('win-modal');
    if (e.target === modal) {
        closeModal();
    }
});