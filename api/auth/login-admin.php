<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000"); // adjust to your React port
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once("../../src/conn.php");
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));
$email = $data->email ?? '';
$password = $data->password ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password required.']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM admin WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if ($user['password'] === $password) {
        // Save admin session data
        $_SESSION['admin'] = [
            'id' => $user['admin_id'],
            'email' => $user['email']
        ];
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Incorrect password.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Admin not found.']);
}
