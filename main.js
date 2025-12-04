// ================================
// Main JavaScript - Global Functions
// ================================

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateUserGreeting();
    updateCartCount();
    initMobileMenu();
});

// Check if user is authenticated
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Skip auth check for login page
    if (currentPage === 'login.html' || currentPage === '') {
        return;
    }
    
    // Check for user session
    const user = getUserSession();
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
}

// Get user session
function getUserSession() {
    const localUser = localStorage.getItem('catCafeUser');
    const sessionUser = sessionStorage.getItem('catCafeUser');
    
    if (localUser) {
        return JSON.parse(localUser);
    } else if (sessionUser) {
        return JSON.parse(sessionUser);
    }
    return null;
}

// Update user greeting in navbar
function updateUserGreeting() {
    const user = getUserSession();
    const greetingElement = document.getElementById('userGreeting');
    
    if (user && greetingElement) {
        const name = user.firstName || 'Guest';
        greetingElement.textContent = `Hello, ${name}!`;
    }
}

// Handle logout
function handleLogout() {
    // Clear sessions
    localStorage.removeItem('catCafeUser');
    sessionStorage.removeItem('catCafeUser');
    
    // Clear cart
    localStorage.removeItem('catCafeCart');
    
    // Show notification
    showNotification('Logged out successfully', 'success');
    
    // Redirect to login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

// ================================
// Shopping Cart Functions
// ================================

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('catCafeCart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('catCafeCart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity || 1,
            image: item.image || '',
            category: item.category || 'product'
        });
    }
    
    saveCart(cart);
    showNotification(`${item.name} added to cart!`, 'success');
    return cart;
}

// Remove item from cart
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    showNotification('Item removed from cart', 'success');
}

// Update item quantity
function updateCartItemQuantity(itemId, quantity) {
    const cart = getCart();
    const item = cart.find(cartItem => cartItem.id === itemId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = parseInt(quantity);
            saveCart(cart);
        }
    }
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem('catCafeCart');
    updateCartCount();
    showNotification('Cart cleared', 'success');
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in navbar
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// ================================
// Mobile Menu
// ================================

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// ================================
// Notification System
// ================================

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.textContent = message;
    
    // Set styles based on type
    const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#FF5252' : '#2196F3';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        font-family: 'Quicksand', sans-serif;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        max-width: 300px;
    `;
    
    // Add animation styles if not already present
    if (!document.getElementById('notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ================================
// Form Validation Helpers
// ================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return re.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ================================
// Smooth Scroll for Anchor Links
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ================================
// Utility Functions
// ================================

// Format price to currency
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ================================
// Loading State
// ================================

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading-overlay';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    loader.innerHTML = '<div style="font-size: 2rem; color: #FFB5C0;">Loading...</div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
        loader.remove();
    }
}