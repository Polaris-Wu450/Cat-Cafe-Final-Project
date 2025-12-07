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

// Initialize receipt page
document.addEventListener('DOMContentLoaded', function() {
    // Get order info from sessionStorage or URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const lastOrder = sessionStorage.getItem('lastOrder');
    
    if (lastOrder) {
        const order = JSON.parse(lastOrder);
        displayReceipt(order);
    } else if (orderId) {
        // Try to fetch order from server
        fetchOrderDetails(orderId);
    } else {
        // No order info, redirect to home
        window.location.href = 'home.html';
    }
    
    updateCartCount();
});

// Display receipt
function displayReceipt(order) {
    const receiptContent = document.getElementById('receipt-content');
    
    // Parse date - SQLite stores datetime as string without timezone
    // If it's in format 'YYYY-MM-DD HH:MM:SS', treat it as EST/EDT
    let orderDate;
    if (order.date) {
        const dateStr = order.date.toString();
        // Check if it's SQLite datetime format (YYYY-MM-DD HH:MM:SS)
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
            // Treat as EST/EDT time directly
            orderDate = new Date(dateStr + ' EST');
        } else {
            orderDate = new Date(order.date);
        }
    } else {
        orderDate = new Date();
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
    order.items.forEach(item => {
        itemsHtml += `
            <div class="receipt-item">
                <div class="receipt-item-info">
                    <span class="receipt-item-name">${item.name}</span>
                    <span class="receipt-item-quantity">x${item.quantity}</span>
                </div>
                <span class="receipt-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    receiptContent.innerHTML = `
        <div class="receipt-details">
            <div class="receipt-section">
                <h2>Order Details</h2>
                <div class="receipt-info-row">
                    <span>Order ID:</span>
                    <span class="receipt-order-id">#${order.orderId}</span>
                </div>
                <div class="receipt-info-row">
                    <span>Date:</span>
                    <span>${formattedDate}</span>
                </div>
            </div>

            <div class="receipt-section">
                <h2>Items</h2>
                <div class="receipt-items">
                    ${itemsHtml}
                </div>
            </div>

            <div class="receipt-section">
                <h2>Summary</h2>
                <div class="receipt-summary-row">
                    <span>Subtotal:</span>
                    <span>$${order.subtotal.toFixed(2)}</span>
                </div>
                <div class="receipt-summary-row">
                    <span>Tax (8%):</span>
                    <span>$${order.tax.toFixed(2)}</span>
                </div>
                <div class="receipt-summary-row receipt-total">
                    <span>Total:</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

// Fetch order details from server
function fetchOrderDetails(orderId) {
    const user = getUserSession();
    if (!user || user.isGuest) {
        window.location.href = 'home.html';
        return;
    }
    
    $.ajax({
        url: 'order-details.php',
        method: 'GET',
        data: {
            orderId: orderId,
            userId: user.id
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displayReceipt(response.order);
            } else {
                window.location.href = 'home.html';
            }
        },
        error: function() {
            window.location.href = 'home.html';
        }
    });
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

