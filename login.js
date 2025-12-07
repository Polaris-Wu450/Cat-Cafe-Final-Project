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
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.querySelector('input[name="remember"]').checked;
    
    // JavaScript validation before sending to PHP
    if (!email) {
        showNotification('Email is required', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!password) {
        showNotification('Password is required', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    // Send to PHP backend
    $.ajax({
        url: 'login.php',
        method: 'POST',
        data: {
            email: email,
            password: password
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // Store user session
                const user = {
                    id: response.user.id,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    email: response.user.email,
                    isGuest: false,
                    loginTime: new Date().toISOString()
                };
                
                if (remember) {
                    localStorage.setItem('catCafeUser', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('catCafeUser', JSON.stringify(user));
                }
                
                showNotification('Login successful! Welcome back!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                showNotification(response.errors[0] || 'Login failed', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = 'An error occurred. Please try again.';
            
            // Try to parse error response
            if (xhr.responseText) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.errors && response.errors.length > 0) {
                        errorMessage = response.errors[0];
                    } else if (response.error) {
                        errorMessage = response.error;
                    }
                } catch (e) {
                    // If not JSON, show raw response or status
                    if (xhr.status === 0) {
                        errorMessage = 'Cannot connect to server. Please check if PHP is running and database is initialized.';
                    } else if (xhr.status === 404) {
                        errorMessage = 'Server file not found. Please check PHP file exists.';
                    } else {
                        errorMessage = 'Server error: ' + xhr.status + ' ' + xhr.statusText;
                    }
                }
            }
            
            showNotification(errorMessage, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.querySelector('input[name="terms"]').checked;
    
    // JavaScript validation before sending to PHP
    if (!firstName) {
        showNotification('First name is required', 'error');
        return;
    }
    
    if (firstName.length < 2) {
        showNotification('First name must be at least 2 characters', 'error');
        return;
    }
    
    if (!lastName) {
        showNotification('Last name is required', 'error');
        return;
    }
    
    if (lastName.length < 2) {
        showNotification('Last name must be at least 2 characters', 'error');
        return;
    }
    
    if (!email) {
        showNotification('Email is required', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!password) {
        showNotification('Password is required', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    // Send to PHP backend
    $.ajax({
        url: 'signup.php',
        method: 'POST',
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // Store user session
                const user = {
                    id: response.user.id,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    email: response.user.email,
                    isGuest: false,
                    signupTime: new Date().toISOString()
                };
                
                sessionStorage.setItem('catCafeUser', JSON.stringify(user));
                
                showNotification('Account created successfully! Welcome to Cat Café!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                showNotification(response.errors[0] || 'Signup failed', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = 'An error occurred. Please try again.';
            
            // Try to parse error response
            if (xhr.responseText) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.errors && response.errors.length > 0) {
                        errorMessage = response.errors[0];
                    } else if (response.error) {
                        errorMessage = response.error;
                    }
                } catch (e) {
                    // If not JSON, show raw response or status
                    if (xhr.status === 0) {
                        errorMessage = 'Cannot connect to server. Please check if PHP is running and database is initialized.';
                    } else if (xhr.status === 404) {
                        errorMessage = 'Server file not found. Please check PHP file exists.';
                    } else {
                        errorMessage = 'Server error: ' + xhr.status + ' ' + xhr.statusText;
                    }
                }
            }
            
            showNotification(errorMessage, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
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