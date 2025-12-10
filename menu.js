// Menu items data
const menuItems = [
    // Drinks
    { id: 1, name: 'Caramel Macchiato', price: 5.50, category: 'drinks', emoji: '☕' },
    { id: 2, name: 'Matcha Latte', price: 5.00, category: 'drinks', emoji: '🍵' },
    { id: 3, name: 'Espresso', price: 3.50, category: 'drinks', emoji: '☕⚡' },
    { id: 4, name: 'Hot Chocolate', price: 4.50, category: 'drinks', emoji: '🥤' },
    
    // Food
    { id: 5, name: 'Avocado Toast', price: 8.50, category: 'food', emoji: '🥑🍞' },
    { id: 6, name: 'Caesar Salad', price: 9.00, category: 'food', emoji: '🥗' },
    { id: 7, name: 'Grilled Cheese', price: 7.50, category: 'food', emoji: '🥪' },
    { id: 8, name: 'Quiche', price: 8.00, category: 'food', emoji: '🥧🍳' },
    
    // Desserts
    { id: 9, name: 'Cheesecake', price: 6.50, category: 'desserts', emoji: '🍰' },
    { id: 10, name: 'Chocolate Brownie', price: 5.50, category: 'desserts', emoji: '🍫' },
    { id: 11, name: 'Tiramisu', price: 7.00, category: 'desserts', emoji: '🍮' },
    { id: 12, name: 'Apple Pie', price: 6.00, category: 'desserts', emoji: '🥧' },
    
    // Cat Treats
    { id: 13, name: 'Premium Cat Treats', price: 4.00, category: 'cat-treats', emoji: '🐾' },
    { id: 14, name: 'Catnip Cookies', price: 3.50, category: 'cat-treats', emoji: '🍪' },
    { id: 15, name: 'Salmon Bites', price: 5.00, category: 'cat-treats', emoji: '🐟' }
];

// Initialize menu page
document.addEventListener('DOMContentLoaded', function() {
    displayMenuItems();
    initFilterButtons();
    updateCartCount();
});

// Display menu items
function displayMenuItems(category = 'all') {
    const menuGrid = document.getElementById('menu-items');
    menuGrid.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = '<p class="no-items">No items found in this category.</p>';
        return;
    }
    
    filteredItems.forEach(item => {
        const menuItemCard = createMenuItemCard(item);
        menuGrid.appendChild(menuItemCard);
    });
}

// Create menu item card
function createMenuItemCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    card.dataset.category = item.category;
    card.classList.add(`category-${item.category}`);
    
    // Add soft hyphens for better word breaking (using Unicode soft hyphen)
    let iconText = item.emoji;
    if (iconText === 'Sandwich') {
        iconText = 'Sand\u00ADwich'; // \u00AD is soft hyphen
    } else if (iconText === 'Dessert') {
        iconText = 'Des\u00ADsert'; // \u00AD is soft hyphen
    }
    
    card.innerHTML = `
        <div class="menu-item-icon">${iconText}</div>
        <div class="menu-item-info">
            <h3 class="menu-item-name">${item.name}</h3>
            <p class="menu-item-category">${item.category.replace('-', ' ')}</p>
            <p class="menu-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <button class="add-to-cart-btn" onclick="addItemToCart(${item.id})">
            Add to Cart
        </button>
    `;
    
    return card;
}

// Initialize filter buttons
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category from data attribute
            const category = this.dataset.category;
            displayMenuItems(category);
        });
    });
}

// Add item to cart
function addItemToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
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
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
            emoji: item.emoji,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show feedback
    showAddToCartFeedback(item.name);
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
