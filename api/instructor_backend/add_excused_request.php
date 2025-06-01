<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once('../src/conn.php');

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    if (isset($data['attendance_id']) && isset($data['reason'])) {
        $attendance_id = $data['attendance_id'];
        $reason = $data['reason'];
        $status = 'Pending';

        $stmt = $conn->prepare("INSERT INTO excused_request (attendance_id, reason, status) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $attendance_id, $reason, $status);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Excused request submitted successfully.';
        } else {
            $response['success'] = false;
            $response['message'] = 'Failed to insert excused request: ' . $stmt->error;
        }

        $stmt->close();
    } else {
        $response['success'] = false;
        $response['message'] = 'Missing required parameters (attendance_id or reason).';
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method. Only POST is allowed.';
}

echo json_encode($response);

$conn->close();
?>