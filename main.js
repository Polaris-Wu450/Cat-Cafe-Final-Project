// ================================
// Main JavaScript - Global Functions
// ================================

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateUserGreeting();
    updateCartCount();
    updateNavbarAuth();
    initMobileMenu();
});

// Check if user is authenticated
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Skip auth check for login page and index
    if (currentPage === 'login.html' || currentPage === '' || currentPage === 'index.html') {
        return;
    }
    
    // Pages that require full login (not guest)
    const restrictedPages = ['reservation.html', 'cats.html'];
    const requiresFullLogin = restrictedPages.includes(currentPage);
    
    // Check for user session
    const user = getUserSession();
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Check if guest user trying to access restricted pages
    if (requiresFullLogin && user.isGuest) {
        showLoginRequiredMessage();
        // Don't auto-redirect, let user choose
    }
}

// Show login required message
function showLoginRequiredMessage() {
    const message = document.createElement('div');
    message.className = 'login-required-message';
    message.innerHTML = `
        <div class="login-required-content">
            <h2>Login Required</h2>
            <p>This page requires a full account. Please log in to continue.</p>
            <p>Make your choice:</p>
            <div class="login-required-buttons">
                <a href="login.html" class="btn-primary" onclick="window.location.href='login.html'; return false;">Login / Sign Up</a>
                <a href="home.html" class="btn-secondary" onclick="window.location.href='home.html'; return false;">Go to Home</a>
            </div>
        </div>
    `;
    message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Add styles if not present
    if (!document.getElementById('login-required-styles')) {
        const style = document.createElement('style');
        style.id = 'login-required-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .login-required-content {
                background: var(--white);
                padding: 3rem;
                border-radius: var(--radius-lg);
                max-width: 500px;
                text-align: center;
                box-shadow: var(--shadow-lg);
                animation: slideUp 0.5s ease;
            }
            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            .login-required-content h2 {
                color: var(--primary-pink);
                margin-bottom: 1rem;
                font-size: 2rem;
            }
            .login-required-content p {
                color: var(--text-light);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            .login-required-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
                justify-content: center;
            }
            .login-required-buttons .btn-primary,
            .login-required-buttons .btn-secondary {
                padding: 0.875rem 2rem;
                border-radius: var(--radius-sm);
                text-decoration: none;
                font-weight: 600;
                transition: var(--transition);
                display: inline-block;
                cursor: pointer;
            }
            .login-required-buttons .btn-primary {
                background: var(--primary-pink);
                color: var(--white);
            }
            .login-required-buttons .btn-primary:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            .login-required-buttons .btn-secondary {
                background: var(--white);
                color: var(--primary-pink);
                border: 2px solid var(--primary-pink);
            }
            .login-required-buttons .btn-secondary:hover {
                background: var(--primary-pink);
                color: var(--white);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
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

// Update navbar with login/logout button
function updateNavbarAuth() {
    const user = getUserSession();
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navMenu) return;
    
    // Remove existing auth button if any
    const existingAuthBtn = navMenu.querySelector('.nav-auth-btn');
    if (existingAuthBtn) {
        existingAuthBtn.remove();
    }
    
    // Create auth button
    const authLi = document.createElement('li');
    authLi.className = 'nav-auth-item';
    
    if (user) {
        if (user.isGuest) {
            // Guest user - show login button
            const loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.className = 'nav-auth-btn nav-login-btn';
            loginLink.textContent = 'Login';
            loginLink.onclick = function(e) {
                e.preventDefault();
                window.location.href = 'login.html';
                return false;
            };
            authLi.appendChild(loginLink);
        } else {
            // Logged in user - show logout button
            authLi.innerHTML = '<a href="#" class="nav-auth-btn nav-logout-btn" onclick="handleLogout(); return false;">Logout</a>';
        }
    } else {
        // No user - show login button
        const loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.className = 'nav-auth-btn nav-login-btn';
        loginLink.textContent = 'Login';
        loginLink.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
            return false;
        };
        authLi.appendChild(loginLink);
    }
    
    navMenu.appendChild(authLi);
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