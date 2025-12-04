// ================================
// Login Page JavaScript
// ================================

// Switch between login and signup forms
function switchForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (formType === 'signup') {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.querySelector('input[name="remember"]').checked;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // For Stage 1, we'll just store user info and redirect
    // In Stage 2, this will make an API call to authenticate
    const user = {
        email: email,
        isGuest: false,
        loginTime: new Date().toISOString()
    };
    
    // Store user session
    if (remember) {
        localStorage.setItem('catCafeUser', JSON.stringify(user));
    } else {
        sessionStorage.setItem('catCafeUser', JSON.stringify(user));
    }
    
    // Show success message and redirect
    showNotification('Login successful! Welcome back!', 'success');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.querySelector('input[name="terms"]').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // For Stage 1, we'll just store user info and redirect
    // In Stage 2, this will make an API call to create account
    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        isGuest: false,
        signupTime: new Date().toISOString()
    };
    
    // Store user session
    sessionStorage.setItem('catCafeUser', JSON.stringify(user));
    
    // Show success message and redirect
    showNotification('Account created successfully! Welcome to Cat Café!', 'success');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}

// Guest login
function guestLogin() {
    const guestUser = {
        email: 'guest@catcafe.com',
        firstName: 'Guest',
        isGuest: true,
        loginTime: new Date().toISOString()
    };
    
    // Store guest session
    sessionStorage.setItem('catCafeUser', JSON.stringify(guestUser));
    
    // Show success message and redirect
    showNotification('Welcome, Guest! Enjoy your visit!', 'success');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 800);
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    const bgColor = type === 'success' ? '#4CAF50' : '#FF5252';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    // Add CSS animation
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const localUser = localStorage.getItem('catCafeUser');
    const sessionUser = sessionStorage.getItem('catCafeUser');
    
    let user = null;
    if (localUser) {
        user = JSON.parse(localUser);
    } else if (sessionUser) {
        user = JSON.parse(sessionUser);
    }
    
    // Only redirect if user is logged in AND not a guest
    // Guests should be able to access login page to create a full account
    if (user && !user.isGuest) {
        // User is already logged in with a full account, redirect to home
        window.location.href = 'home.html';
    }
    // If user is guest or no user, stay on login page
});