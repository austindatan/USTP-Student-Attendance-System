<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: *");

$conn = new mysqli("localhost", "root", "austinreverie", "attendance_monitoring");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

$id = $_GET["id"] ?? '';

if (!$id || !is_numeric($id)) {
    echo json_encode(["success" => false, "message" => "Invalid or missing student ID."]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM student WHERE student_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    unset($row["password"]);
    echo json_encode(["success" => true, "student" => $row]);
} else {
    echo json_encode(["success" => false, "message" => "Student not found."]);
}

$conn->close();