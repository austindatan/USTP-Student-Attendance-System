<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php'; 

$course_id = $_GET['id'] ?? null;

if (!$course_id) {
    echo json_encode(["success" => false, "message" => "No course ID provided."]);
    exit;
}

$sql = "SELECT * FROM course WHERE course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $course_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["success" => false, "message" => "Course not found."]);
}

$stmt->close();
$conn->close();
?>
