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
            <span>${item.emoji}</span>
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
                🗑️
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
        alert('Your cart is empty!');
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

    // Show confirmation
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const message = `
Order Summary:
${itemCount} item(s)
Subtotal: $${subtotal.toFixed(2)}
Tax: $${tax.toFixed(2)}
Total: $${total.toFixed(2)}

Proceed to checkout?
    `;

    if (confirm(message)) {
        // In a real application, this would redirect to payment page
        alert('🎉 Thank you for your order!\n\nOrder confirmation will be sent to your email.');
        localStorage.removeItem('cart');
        window.location.href = 'home.html';
    }
}

// Validate cart
function validateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if cart has items
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return false;
    }

    // Validate each item
    for (let item of cart) {
        // Check quantity
        if (!item.quantity || item.quantity < 1) {
            alert(`Invalid quantity for ${item.name}`);
            return false;
        }

        // Check price
        if (!item.price || item.price <= 0) {
            alert(`Invalid price for ${item.name}`);
            return false;
        }

        // Check if quantity is too high (optional validation)
        if (item.quantity > 99) {
            alert(`Maximum quantity (99) exceeded for ${item.name}`);
            return false;
        }
    }

    return true;
}