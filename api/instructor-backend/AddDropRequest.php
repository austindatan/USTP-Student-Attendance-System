<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include __DIR__ . '/../../src/conn.php';

$data = json_decode(file_get_contents("php://input"));

$student_details_id = $data->student_details_id ?? null;
$reason = $data->reason ?? null;
$status = "Pending";

if (!is_numeric($student_details_id) || empty(trim($reason))) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO drop_request (student_details_id, reason, status) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $student_details_id, $reason, $status);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Drop request submitted.",
        "drop_request_id" => $stmt->insert_id
    ]);
} else {
    error_log("Drop request error: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
