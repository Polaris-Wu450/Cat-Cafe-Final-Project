<?php
/**
 * Search Script
 * Searches menu items in SQLite3 database
 */

header('Content-Type: application/json');

// Initialize database - use databases/ directory on server, or current directory locally
$db_path = file_exists('databases/cat_cafe.db') ? 'databases/cat_cafe.db' : 'cat_cafe.db';
$db = new SQLite3($db_path);

// Get search query
$query = $_GET['q'] ?? '';
$category = $_GET['category'] ?? '';

// Validate input
if (empty($query) && empty($category)) {
    echo json_encode([
        'success' => false,
        'errors' => ['Search query or category is required']
    ]);
    $db->close();
    exit;
}

// Build SQL query
$sql = "SELECT id, name, price, category, description FROM menu_items WHERE 1=1";
$params = [];

if (!empty($query)) {
    $sql .= " AND (name LIKE ? OR description LIKE ?)";
    $searchTerm = '%' . $query . '%';
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

if (!empty($category) && $category !== 'all') {
    $sql .= " AND category = ?";
    $params[] = $category;
}

$sql .= " ORDER BY name";

$stmt = $db->prepare($sql);
foreach ($params as $index => $param) {
    $stmt->bindValue($index + 1, $param, SQLITE3_TEXT);
}

$result = $stmt->execute();
$items = [];

while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $items[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'price' => $row['price'],
        'category' => $row['category'],
        'description' => $row['description']
    ];
}

echo json_encode([
    'success' => true,
    'items' => $items,
    'count' => count($items)
]);

$db->close();
?>

