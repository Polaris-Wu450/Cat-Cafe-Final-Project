<?php
/**
 * User Registration Script
 * Handles user signup and stores data in SQLite3
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
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

// Validate input
$errors = [];

if (empty($firstName)) {
    $errors[] = 'First name is required';
}

if (empty($lastName)) {
    $errors[] = 'Last name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($password) || strlen($password) < 6) {
    $errors[] = 'Password must be at least 6 characters';
}

if ($password !== $confirmPassword) {
    $errors[] = 'Passwords do not match';
}

// Check if email already exists
if (empty($errors)) {
    try {
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        if (!$stmt) {
            throw new Exception('Failed to prepare statement: ' . $db->lastErrorMsg());
        }
        $stmt->bindValue(1, $email, SQLITE3_TEXT);
        $result = $stmt->execute();
        if (!$result) {
            throw new Exception('Failed to execute query: ' . $db->lastErrorMsg());
        }
        if ($result->fetchArray()) {
            $errors[] = 'Email already registered';
        }
    } catch (Exception $e) {
        $errors[] = 'Database error: ' . $e->getMessage();
    }
}

// If no errors, insert user
if (empty($errors)) {
    try {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        if (!$hashedPassword) {
            throw new Exception('Failed to hash password');
        }
        
        $stmt = $db->prepare("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
            throw new Exception('Failed to prepare statement: ' . $db->lastErrorMsg());
        }
        $stmt->bindValue(1, $firstName, SQLITE3_TEXT);
        $stmt->bindValue(2, $lastName, SQLITE3_TEXT);
        $stmt->bindValue(3, $email, SQLITE3_TEXT);
        $stmt->bindValue(4, $hashedPassword, SQLITE3_TEXT);
        
        if ($stmt->execute()) {
            $userId = $db->lastInsertRowID();
            echo json_encode([
                'success' => true,
                'message' => 'Account created successfully!',
                'user' => [
                    'id' => $userId,
                    'firstName' => $firstName,
                    'lastName' => $lastName,
                    'email' => $email
                ]
            ]);
        } else {
            throw new Exception('Failed to execute insert: ' . $db->lastErrorMsg());
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

