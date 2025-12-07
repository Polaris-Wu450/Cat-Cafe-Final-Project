<?php
/**
 * Order Details Script
 * Retrieves a specific order's details from SQLite3
 */

header('Content-Type: application/json');

// Initialize database - use databases/ directory on server, or current directory locally
$db_path = file_exists('databases/cat_cafe.db') ? 'databases/cat_cafe.db' : 'cat_cafe.db';
try {
    if (!file_exists($db_path)) {
        throw new Exception('Database file not found.');
    }
    $db = new SQLite3($db_path);
    if (!$db) {
        throw new Exception('Failed to connect to database.');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'errors' => ['Database error: ' . $e->getMessage()]
    ]);
    exit;
}

// Get order ID and user ID
$orderId = $_GET['orderId'] ?? null;
$userId = $_GET['userId'] ?? null;

if (empty($orderId) || empty($userId)) {
    echo json_encode([
        'success' => false,
        'errors' => ['Order ID and User ID are required']
    ]);
    exit;
}

try {
    // Get order
    $stmt = $db->prepare("SELECT id, items, subtotal, tax, total, created_at FROM orders WHERE id = ? AND user_id = ?");
    $stmt->bindValue(1, $orderId, SQLITE3_INTEGER);
    $stmt->bindValue(2, $userId, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $row = $result->fetchArray(SQLITE3_ASSOC);
    
    if (!$row) {
        echo json_encode([
            'success' => false,
            'errors' => ['Order not found']
        ]);
        exit;
    }
    
    // Parse items JSON
    $items = json_decode($row['items'], true);
    if (!is_array($items)) {
        $items = [];
    }
    
    echo json_encode([
        'success' => true,
        'order' => [
            'orderId' => $row['id'],
            'items' => $items,
            'subtotal' => $row['subtotal'],
            'tax' => $row['tax'],
            'total' => $row['total'],
            'date' => $row['created_at']
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'errors' => ['Database error: ' . $e->getMessage()]
    ]);
}

$db->close();
?>

