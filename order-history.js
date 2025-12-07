// Get user session helper
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

// Initialize order history page
document.addEventListener('DOMContentLoaded', function() {
    const user = getUserSession();
    
    if (!user || user.isGuest) {
        showLoginRequiredMessage();
        return;
    }
    
    loadOrderHistory();
    updateCartCount();
});

// Show login required message for guest users
function showLoginRequiredMessage() {
    const container = document.getElementById('order-history-container');
    container.innerHTML = `
        <div class="login-required-message">
            <div class="login-required-content">
                <h2>Login Required</h2>
                <p>Order History is only available for registered users.</p>
                <p>Please log in to view your order history.</p>
                <div class="login-required-buttons">
                    <a href="login.html" class="btn btn-primary">Login / Sign Up</a>
                    <a href="home.html" class="btn btn-secondary">Go to Home</a>
                </div>
            </div>
        </div>
    `;
    
    // Add styles if not present
    if (!document.getElementById('login-required-styles')) {
        const style = document.createElement('style');
        style.id = 'login-required-styles';
        style.textContent = `
            .login-required-message {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                padding: 2rem;
            }
            .login-required-content {
                background: var(--white);
                padding: 3rem;
                border-radius: var(--radius-lg);
                max-width: 500px;
                text-align: center;
                box-shadow: var(--shadow-lg);
            }
            .login-required-content h2 {
                color: var(--primary-brown);
                margin-bottom: 1rem;
                font-size: 2rem;
            }
            .login-required-content p {
                color: var(--text-light);
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }
            .login-required-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
                justify-content: center;
            }
            .login-required-buttons .btn {
                padding: 0.875rem 2rem;
                border-radius: var(--radius-sm);
                text-decoration: none;
                font-weight: 600;
                transition: var(--transition);
                display: inline-block;
            }
            .login-required-buttons .btn-primary {
                background: var(--primary-brown);
                color: var(--white);
            }
            .login-required-buttons .btn-primary:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            .login-required-buttons .btn-secondary {
                background: var(--white);
                color: var(--primary-brown);
                border: 2px solid var(--primary-brown);
            }
            .login-required-buttons .btn-secondary:hover {
                background: var(--primary-brown);
                color: var(--white);
            }
        `;
        document.head.appendChild(style);
    }
}

// Load order history
function loadOrderHistory() {
    const user = getUserSession();
    const container = document.getElementById('order-history-container');
    
    $.ajax({
        url: 'order-history.php',
        method: 'GET',
        data: {
            userId: user.id
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                if (response.orders && response.orders.length > 0) {
                    displayOrders(response.orders);
                } else {
                    container.innerHTML = `
                        <div class="empty-cart">
                            <div class="empty-cart-content">
                                <div class="empty-cart-icon">Order</div>
                                <h2>No orders yet</h2>
                                <p>Start shopping to see your order history!</p>
                                <a href="menu.html" class="btn-primary">Browse Menu</a>
                            </div>
                        </div>
                    `;
                }
            } else {
                container.innerHTML = '<div class="error-message">Failed to load order history. Please try again.</div>';
            }
        },
        error: function() {
            container.innerHTML = '<div class="error-message">An error occurred. Please try again.</div>';
        }
    });
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('order-history-container');
    
    let ordersHtml = '<div class="orders-list">';
    
    orders.forEach(order => {
        // Parse date - SQLite stores datetime as string without timezone
        // If it's in format 'YYYY-MM-DD HH:MM:SS', treat it as EST/EDT
        const dateStr = order.order_date.toString();
        let orderDate;
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
            // Treat as EST/EDT time directly
            orderDate = new Date(dateStr + ' EST');
        } else {
            orderDate = new Date(order.order_date);
        }
        
        const formattedDate = orderDate.toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
        
        let itemsHtml = '';
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                itemsHtml += `
                    <div class="order-item-row">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            });
        }
        
        ordersHtml += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order #${order.id}</h3>
                        <p class="order-date">${formattedDate}</p>
                    </div>
                    <div class="order-total">
                        <span>$${parseFloat(order.total).toFixed(2)}</span>
                    </div>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
                <div class="order-actions">
                    <a href="receipt.html?orderId=${order.id}" class="btn-view-receipt">View Receipt</a>
                </div>
            </div>
        `;
    });
    
    ordersHtml += '</div>';
    container.innerHTML = ordersHtml;
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

