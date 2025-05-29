<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['excused_request_id'], $data['status'])) {
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    $excuse_req_id = $data['excused_request_id'];
    $status = $data['status'];

    $stmt = $conn->prepare("UPDATE excused_request SET status=? WHERE excused_request_id=?");

    if (!$stmt) {
        echo json_encode(["error" => "Prepare failed", "details" => $conn->error]);
        exit;
    }

    $stmt->bind_param("si", $status, $excuse_req_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Request updated"]);
    } else {
        echo json_encode(["error" => "Execution failed", "details" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
