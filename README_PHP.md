# PHP Backend Integration Guide

## Database Setup

### 1. Initialize Database
Run the initialization script to create the database and tables:
```bash
php init_db.php
```

This will create:
- `cat_cafe.db` - SQLite3 database file
- `users` table - Stores user accounts
- `orders` table - Stores shopping cart orders
- `menu_items` table - Stores menu items with default data

## PHP Scripts

### 1. signup.php
**Purpose:** User registration
**Method:** POST
**Parameters:**
- `firstName` (required)
- `lastName` (required)
- `email` (required, must be valid email)
- `password` (required, min 6 characters)
- `confirmPassword` (required, must match password)

**Response:**
```json
{
    "success": true,
    "message": "Account created successfully!",
    "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
    }
}
```

### 2. login.php
**Purpose:** User authentication
**Method:** POST
**Parameters:**
- `email` (required, must be valid email)
- `password` (required)

**Response:**
```json
{
    "success": true,
    "message": "Login successful!",
    "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
    }
}
```

### 3. cart.php
**Purpose:** Store shopping cart orders
**Method:** POST
**Parameters:**
- `userId` (required, integer)
- `items` (required, JSON string)
- `subtotal` (required, float)
- `tax` (required, float)
- `total` (required, float)

**Response:**
```json
{
    "success": true,
    "message": "Order placed successfully!",
    "orderId": 1
}
```

### 4. search.php
**Purpose:** Search menu items
**Method:** GET
**Parameters:**
- `q` (optional, search query)
- `category` (optional, filter by category)

**Response:**
```json
{
    "success": true,
    "items": [
        {
            "id": 1,
            "name": "Caramel Macchiato",
            "price": 5.50,
            "category": "drinks",
            "description": "Rich espresso with caramel and steamed milk"
        }
    ],
    "count": 1
}
```

## JavaScript Validation

All forms include client-side validation before sending data to PHP:

### Signup Validation
- First name: required, min 2 characters
- Last name: required, min 2 characters
- Email: required, valid email format
- Password: required, min 6 characters
- Confirm password: must match password
- Terms: must be accepted

### Login Validation
- Email: required, valid email format
- Password: required, min 6 characters

### Cart Validation
- User must be logged in (not guest)
- Cart must not be empty
- All prices must be valid numbers
- Quantities must be between 1-99

## AJAX Implementation

All PHP calls use jQuery AJAX:

```javascript
$.ajax({
    url: 'script.php',
    method: 'POST',
    data: { /* parameters */ },
    dataType: 'json',
    success: function(response) {
        // Handle success
    },
    error: function(xhr, status, error) {
        // Handle error
    }
});
```

## Security Features

1. **Password Hashing:** All passwords are hashed using `password_hash()` with PASSWORD_DEFAULT
2. **SQL Injection Prevention:** All queries use prepared statements
3. **Input Validation:** Both client-side (JavaScript) and server-side (PHP) validation
4. **Email Uniqueness:** Database enforces unique email addresses

## File Structure

```
Cat-Cafe-Final-Project/
├── init_db.php          # Database initialization
├── signup.php           # User registration
├── login.php            # User authentication
├── cart.php             # Order processing
├── search.php           # Menu search
└── cat_cafe.db          # SQLite3 database (created after init)
```

## Testing

1. Initialize database: `php init_db.php`
2. Test signup: Fill out registration form
3. Test login: Use registered credentials
4. Test cart: Add items and checkout
5. Test search: Type in search box on menu page

