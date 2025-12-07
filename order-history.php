<?php
/**
 * Order History Script
 * Retrieves user's order history from SQLite3
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

// Get user ID
$userId = $_GET['userId'] ?? null;

if (empty($userId)) {
    echo json_encode([
        'success' => false,
        'errors' => ['User ID is required']
    ]);
    exit;
}

try {
    // Get orders for user - sorted from latest to earliest
    $stmt = $db->prepare("SELECT id, items, subtotal, tax, total, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC");
    $stmt->bindValue(1, $userId, SQLITE3_INTEGER);
    $result = $stmt->execute();
    
    $orders = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        // Parse items JSON
        $items = json_decode($row['items'], true);
        if (!is_array($items)) {
            $items = [];
        }
        
        $orders[] = [
            'id' => $row['id'],
            'items' => $items,
            'subtotal' => $row['subtotal'],
            'tax' => $row['tax'],
            'total' => $row['total'],
            'order_date' => $row['created_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'orders' => $orders
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'errors' => ['Database error: ' . $e->getMessage()]
    ]);
}

$db->close();
?>

