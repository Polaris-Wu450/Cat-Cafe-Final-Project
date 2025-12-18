// Product emoji mapping (matching menu.js)
const productEmojis = {
    'Caramel Macchiato': '☕',
    'Matcha Latte': '🍵',
    'Espresso': '☕⚡',
    'Hot Chocolate': '🥤',
    'Avocado Toast': '🥑🍞',
    'Caesar Salad': '🥗',
    'Grilled Cheese': '🥪',
    'Quiche': '🥧🍳',
    'Cheesecake': '🍰',
    'Chocolate Brownie': '🍫',
    'Tiramisu': '🍮',
    'Apple Pie': '🥧',
    'Premium Cat Treats': '🐾',
    'Catnip Cookies': '🍪',
    'Salmon Bites': '🐟'
};

// Initialize search page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Allow Enter key to trigger search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Perform search
function performSearch() {
    const query = document.getElementById('search-input').value.trim();
    const resultsDiv = document.getElementById('search-results');
    const noResultsDiv = document.getElementById('no-results');
    
    if (!query) {
        resultsDiv.innerHTML = '<p class="no-items">Please enter a search term.</p>';
        noResultsDiv.style.display = 'none';
        return;
    }
    
    // Show loading state
    resultsDiv.innerHTML = '<p class="no-items">Searching...</p>';
    noResultsDiv.style.display = 'none';
    
    // Fetch search results
    fetch(`search.php?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displaySearchResults(data.products);
            } else {
                resultsDiv.innerHTML = `<p class="no-items">Error: ${data.errors ? data.errors.join(', ') : 'Search failed'}</p>`;
                noResultsDiv.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            resultsDiv.innerHTML = '<p class="no-items">An error occurred while searching. Please try again.</p>';
            noResultsDiv.style.display = 'none';
        });
}

// Display search results
function displaySearchResults(products) {
    const resultsDiv = document.getElementById('search-results');
    const noResultsDiv = document.getElementById('no-results');
    
    if (products.length === 0) {
        resultsDiv.innerHTML = '';
        noResultsDiv.style.display = 'block';
        return;
    }
    
    noResultsDiv.style.display = 'none';
    resultsDiv.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        resultsDiv.appendChild(productCard);
    });
}

// Create product card (similar to menu.js)
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    card.dataset.category = product.category;
    card.classList.add(`category-${product.category}`);
    
    const emoji = productEmojis[product.name] || '🍽️';
    
    card.innerHTML = `
        <div class="menu-item-icon">${emoji}</div>
        <div class="menu-item-info">
            <h3 class="menu-item-name">${product.name}</h3>
            <p class="menu-item-category">${product.category.replace('-', ' ')}</p>
            <p class="menu-item-price">$${parseFloat(product.price).toFixed(2)}</p>
            ${product.description ? `<p style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.5rem;">${product.description}</p>` : ''}
        </div>
        <button class="add-to-cart-btn" onclick="addItemToCart(${product.id}, '${product.name}', ${product.price}, '${product.category}', '${emoji}')">
            Add to Cart
        </button>
    `;
    
    return card;
}

// Add item to cart (similar to menu.js)
function addItemToCart(itemId, name, price, category, emoji) {
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
    } else {
        // Add new item
        cart.push({
            id: itemId,
            name: name,
            price: price,
            category: category,
            emoji: emoji,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show feedback
    showAddToCartFeedback(name);
}

// Show feedback when item is added
function showAddToCartFeedback(itemName) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'add-to-cart-feedback';
    feedback.textContent = `${itemName} added to cart!`;
    document.body.appendChild(feedback);
    
    // Animate
    setTimeout(() => {
        feedback.classList.add('show');
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }, 2000);
}

