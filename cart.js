// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updateCartCount();
});

// Display cart items
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartContainer = document.getElementById('empty-cart');
    const cartContainer = document.querySelector('.cart-container');

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCartContainer.style.display = 'block';
        return;
    }

    cartContainer.style.display = 'grid';
    emptyCartContainer.style.display = 'none';
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });

    updateOrderSummary();
}

// Create cart item element
function createCartItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.dataset.itemId = item.id;

    itemDiv.innerHTML = `
        <div class="cart-item-image">
            <span>${item.emoji || item.name.charAt(0)}</span>
        </div>
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <div class="cart-item-category">${item.category.replace('-', ' ')}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove item">
                Remove
            </button>
        </div>
    `;

    return itemDiv;
}

// Increase quantity
function increaseQuantity(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === itemId);

    if (item) {
        // Validate max quantity
        if (item.quantity >= 99) {
            showValidationError('Maximum quantity (99) reached for this item.');
            return;
        }
        item.quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

// Decrease quantity
function decreaseQuantity(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === itemId);

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        } else {
            removeFromCart(itemId);
        }
    }
}

// Remove from cart
function removeFromCart(itemId) {
    if (confirm('Remove this item from cart?')) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        displayCart();
        updateCartCount();
    }
}

// Update order summary
function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
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

// Checkout function
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showValidationError('Your cart is empty! Please add items before checkout.');
        return;
    }

    // Validate cart items
    if (!validateCart()) {
        return;
    }

    // Calculate total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // Show confirmation with formatted message
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const message = `Order Summary:\n\n${itemCount} item(s)\nSubtotal: $${subtotal.toFixed(2)}\nTax (8%): $${tax.toFixed(2)}\nTotal: $${total.toFixed(2)}\n\nProceed to checkout?`;

    if (confirm(message)) {
        // In a real application, this would redirect to payment page
        alert('Thank you for your order!\n\nOrder confirmation will be sent to your email.');
        localStorage.removeItem('cart');
        displayCart();
        updateCartCount();
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 500);
    }
}

// Validate cart
function validateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if cart has items
    if (cart.length === 0) {
        showValidationError('Your cart is empty! Please add items before checkout.');
        return false;
    }

    // Validate each item
    for (let item of cart) {
        // Check if item has required properties
        if (!item.id || !item.name) {
            showValidationError(`Invalid item data: ${item.name || 'Unknown item'}`);
            return false;
        }

        // Check quantity
        if (typeof item.quantity !== 'number' || item.quantity < 1) {
            showValidationError(`Invalid quantity for ${item.name}. Quantity must be at least 1.`);
            return false;
        }

        // Check if quantity is too high
        if (item.quantity > 99) {
            showValidationError(`Maximum quantity (99) exceeded for ${item.name}. Please reduce the quantity.`);
            return false;
        }

        // Check price
        if (typeof item.price !== 'number' || item.price <= 0 || isNaN(item.price)) {
            showValidationError(`Invalid price for ${item.name}. Please contact support.`);
            return false;
        }

        // Check if price is reasonable (not too high)
        if (item.price > 1000) {
            showValidationError(`Price seems unusually high for ${item.name}. Please verify.`);
            return false;
        }
    }

    // Check total amount
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal <= 0 || isNaN(subtotal)) {
        showValidationError('Invalid cart total. Please refresh and try again.');
        return false;
    }

    return true;
}

// Show validation error message
function showValidationError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff5252;
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        max-width: 90%;
        text-align: center;
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation if not present
    if (!document.getElementById('validation-animations')) {
        const style = document.createElement('style');
        style.id = 'validation-animations';
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 5000);
}