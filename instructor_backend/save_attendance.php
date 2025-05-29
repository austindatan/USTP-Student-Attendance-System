<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once('../src/conn.php');

$data = json_decode(file_get_contents("php://input"), true);

$student_details_id = isset($data['student_details_id']) ? (int)$data['student_details_id'] : 0;
$date = isset($data['date']) ? $data['date'] : null;
$status = isset($data['status']) ? $data['status'] : null;

if (!$date || !$status || !$student_details_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$checkQuery = "SELECT 1 FROM attendance WHERE student_details_id = ? AND date = ?";
$stmt = $conn->prepare($checkQuery);
$stmt->bind_param("is", $student_details_id, $date);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $updateQuery = "UPDATE attendance SET status = ? WHERE student_details_id = ? AND date = ?";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param("sis", $status, $student_details_id, $date);
    $updateStmt->execute();
    echo json_encode(['success' => true, 'action' => 'updated']);
    $updateStmt->close();
} else {
    $insertQuery = "INSERT INTO attendance (student_details_id, date, status) VALUES (?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("iss", $student_details_id, $date, $status);
    $insertStmt->execute();
    echo json_encode(['success' => true, 'action' => 'inserted']);
    $insertStmt->close();
}

$stmt->close();
$conn->close();
?>
