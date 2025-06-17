<?php
header('Content-Type: application/json');

$host = '127.0.0.1';
$db   = 'message';  // ✅ Your correct database name
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'msg' => 'Database connection failed: ' . $conn->connect_error
    ]);
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

    // Check if name exists
    $checkStmt = $conn->prepare("SELECT name FROM messages WHERE name = ?");
    $checkStmt->bind_param("s", $name);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        // Update existing message
        $stmt = $conn->prepare("UPDATE messages SET message = ? WHERE name = ?");
        $stmt->bind_param("ss", $message, $name);
        $stmt->execute();
        echo json_encode(['status' => 'ok', 'msg' => 'Message updated.']);
    } else {
        // Insert new message
        $stmt = $conn->prepare("INSERT INTO messages (name, message) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $message);
        $stmt->execute();
        echo json_encode(['status' => 'ok', 'msg' => 'Message saved.']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $name = strtolower(trim($_GET['name'] ?? ''));

    if ($name === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'msg' => 'Name is required.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT message FROM messages WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode([
            'status'  => 'ok',
            'name'    => $name,
            'message' => $row['message']
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'msg' => 'Message not found.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'msg' => 'Invalid request method.']);
?>
