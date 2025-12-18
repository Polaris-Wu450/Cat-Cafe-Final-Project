<?php
/**
 * Product Search Script
 * Searches menu items from SQLite3 database
 */

header('Content-Type: application/json');

// Initialize database - check multiple possible paths
// Priority: i6 server path > current directory (local)
$db_path = '/home/sw5693/databases/cat_cafe.db';
if (!file_exists($db_path)) {
    $db_path = 'cat_cafe.db';
}

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

// Get search query
$query = $_GET['q'] ?? '';

if (empty($query)) {
    echo json_encode([
        'success' => false,
        'errors' => ['Search query is required']
    ]);
    exit;
}

try {
    // Search for products by name (case-insensitive)
    $stmt = $db->prepare("SELECT id, name, price, category, description FROM menu_items WHERE name LIKE ? ORDER BY name ASC");
    $searchTerm = '%' . $query . '%';
    $stmt->bindValue(1, $searchTerm, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    $products = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $products[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'price' => $row['price'],
            'category' => $row['category'],
            'description' => $row['description'] ?? ''
        ];
    }
    
    echo json_encode([
        'success' => true,
        'products' => $products,
        'count' => count($products)
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'errors' => ['Database error: ' . $e->getMessage()]
    ]);
}

$db->close();
?>

