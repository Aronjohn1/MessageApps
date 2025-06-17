<?php
header('Content-Type: application/json');

// Localhost connection (e.g., XAMPP)
$host = '127.0.0.1';
$db   = 'message';  
$user = 'root';
$pass = '';           

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'msg' => 'Database connection failed.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = strtolower(trim($_POST['name'] ?? ''));
    $message = trim($_POST['message'] ?? '');

    if ($name === '' || $message === '') {
        http_response_code(422);
        echo json_encode(['status' => 'error', 'msg' => 'Both name and message are required.']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE messages SET message = ? WHERE name = ?");
    $stmt->bind_param("ss", $message, $name);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'ok', 'msg' => 'Message updated.']);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'msg' => 'Name not found.']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['status' => 'error', 'msg' => 'Invalid request.']);
