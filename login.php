<?php
/**
 * User Login Script
 * Authenticates users using SQLite3 database
 */

header('Content-Type: application/json');

// Initialize database - use databases/ directory on server, or current directory locally
$db_path = file_exists('databases/cat_cafe.db') ? 'databases/cat_cafe.db' : 'cat_cafe.db';
try {
    if (!file_exists($db_path)) {
        throw new Exception('Database file not found. Please run init_db.php first.');
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

// Get POST data
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Validate input
$errors = [];

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($password)) {
    $errors[] = 'Password is required';
}

// If no errors, check credentials
if (empty($errors)) {
    try {
        $stmt = $db->prepare("SELECT id, first_name, last_name, email, password FROM users WHERE email = ?");
        if (!$stmt) {
            throw new Exception('Failed to prepare statement: ' . $db->lastErrorMsg());
        }
        $stmt->bindValue(1, $email, SQLITE3_TEXT);
        $result = $stmt->execute();
        if (!$result) {
            throw new Exception('Failed to execute query: ' . $db->lastErrorMsg());
        }
        $user = $result->fetchArray(SQLITE3_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // Login successful
            echo json_encode([
                'success' => true,
                'message' => 'Login successful!',
                'user' => [
                    'id' => $user['id'],
                    'firstName' => $user['first_name'],
                    'lastName' => $user['last_name'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'errors' => ['Invalid email or password']
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'errors' => ['Database error: ' . $e->getMessage()]
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

