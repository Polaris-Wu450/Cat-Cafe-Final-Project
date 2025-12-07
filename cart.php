<?php
/**
 * Shopping Cart Script
 * Stores orders in SQLite3 database
 */

header('Content-Type: application/json');

// Initialize database - use databases/ directory on server, or current directory locally
$db_path = file_exists('databases/cat_cafe.db') ? 'databases/cat_cafe.db' : 'cat_cafe.db';
$db = new SQLite3($db_path);

// Get POST data
$userId = $_POST['userId'] ?? null;
$items = $_POST['items'] ?? '[]';
$subtotal = $_POST['subtotal'] ?? 0;
$tax = $_POST['tax'] ?? 0;
$total = $_POST['total'] ?? 0;

// Validate input
$errors = [];

if (empty($userId)) {
    $errors[] = 'User ID is required';
}

if (empty($items) || $items === '[]') {
    $errors[] = 'Cart is empty';
}

if (!is_numeric($subtotal) || $subtotal < 0) {
    $errors[] = 'Invalid subtotal';
}

if (!is_numeric($tax) || $tax < 0) {
    $errors[] = 'Invalid tax';
}

if (!is_numeric($total) || $total < 0) {
    $errors[] = 'Invalid total';
}

// Validate user exists
if (empty($errors) && $userId) {
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->bindValue(1, $userId, SQLITE3_INTEGER);
    $result = $stmt->execute();
    if (!$result->fetchArray()) {
        $errors[] = 'Invalid user';
    }
}

// If no errors, insert order
if (empty($errors)) {
    // Set timezone to EST/EDT for order timestamp
    date_default_timezone_set('America/New_York');
    $estTime = date('Y-m-d H:i:s');
    
    $stmt = $db->prepare("INSERT INTO orders (user_id, items, subtotal, tax, total, created_at) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bindValue(1, $userId, SQLITE3_INTEGER);
    $stmt->bindValue(2, $items, SQLITE3_TEXT);
    $stmt->bindValue(3, $subtotal, SQLITE3_FLOAT);
    $stmt->bindValue(4, $tax, SQLITE3_FLOAT);
    $stmt->bindValue(5, $total, SQLITE3_FLOAT);
    $stmt->bindValue(6, $estTime, SQLITE3_TEXT);
    
    if ($stmt->execute()) {
        $orderId = $db->lastInsertRowID();
        echo json_encode([
            'success' => true,
            'message' => 'Order placed successfully!',
            'orderId' => $orderId
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'errors' => ['Failed to place order. Please try again.']
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'errors' => $errors
    ]);
}

$db->close();
?>

