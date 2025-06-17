<?php
header('Content-Type: application/json');

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

    $stmt = $conn->prepare("SELECT id FROM messages WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'msg' => 'This name is already used.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO messages (name, message) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $message);
    $stmt->execute();

    echo json_encode(['status' => 'ok']);
    exit;
}

if (isset($_GET['name'])) {
    $name = strtolower(trim($_GET['name']));

    $stmt = $conn->prepare("SELECT message FROM messages WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $stmt->bind_result($message);

    if ($stmt->fetch()) {
        echo json_encode(['status' => 'ok', 'name' => $name, 'message' => $message]);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'msg' => 'Message not found.']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['status' => 'error', 'msg' => 'Invalid request.']);
