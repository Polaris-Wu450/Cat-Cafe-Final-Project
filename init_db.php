<?php
/**
 * Initialize SQLite3 Database for Cat Café
 * Creates database and tables if they don't exist
 */

$db = new SQLite3('cat_cafe.db');

// Create users table
$db->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

// Create orders table
$db->exec("CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    items TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

// Create menu_items table
$db->exec("CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

// Insert default menu items if table is empty
$count = $db->querySingle("SELECT COUNT(*) FROM menu_items");
if ($count == 0) {
    $menuItems = [
        // Drinks
        ['Caramel Macchiato', 5.50, 'drinks', 'Rich espresso with caramel and steamed milk'],
        ['Matcha Latte', 5.00, 'drinks', 'Premium matcha green tea with steamed milk'],
        ['Espresso', 3.50, 'drinks', 'Strong Italian espresso'],
        ['Hot Chocolate', 4.50, 'drinks', 'Rich and creamy hot chocolate'],
        
        // Food
        ['Avocado Toast', 8.50, 'food', 'Fresh avocado on artisan bread'],
        ['Caesar Salad', 9.00, 'food', 'Classic Caesar salad with croutons'],
        ['Grilled Cheese', 7.50, 'food', 'Melted cheese on toasted bread'],
        ['Quiche', 8.00, 'food', 'Savory egg and cheese quiche'],
        
        // Desserts
        ['Cheesecake', 6.50, 'desserts', 'Creamy New York style cheesecake'],
        ['Chocolate Brownie', 5.50, 'desserts', 'Rich chocolate brownie'],
        ['Tiramisu', 7.00, 'desserts', 'Classic Italian tiramisu'],
        ['Apple Pie', 6.00, 'desserts', 'Homemade apple pie'],
        
        // Cat Treats
        ['Premium Cat Treats', 4.00, 'cat-treats', 'Healthy treats for your feline friends'],
        ['Catnip Cookies', 3.50, 'cat-treats', 'Organic catnip cookies'],
        ['Salmon Bites', 5.00, 'cat-treats', 'Premium salmon treats']
    ];
    
    $stmt = $db->prepare("INSERT INTO menu_items (name, price, category, description) VALUES (?, ?, ?, ?)");
    foreach ($menuItems as $item) {
        $stmt->bindValue(1, $item[0], SQLITE3_TEXT);
        $stmt->bindValue(2, $item[1], SQLITE3_FLOAT);
        $stmt->bindValue(3, $item[2], SQLITE3_TEXT);
        $stmt->bindValue(4, $item[3], SQLITE3_TEXT);
        $stmt->execute();
    }
}

$db->close();
echo "Database initialized successfully!";
?>

