<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include __DIR__ . '/../../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

$student_details_id = $_GET['student_details_id'] ?? null;

if (!$student_details_id) {
    echo json_encode(["success" => false, "message" => "Missing student_details_id"]);
    exit;
}

$sql = "SELECT c.course_id, c.course_name 
        FROM student_details sd
        JOIN section s ON sd.section_id = s.section_id
        JOIN course c ON s.course_id = c.course_id
        WHERE sd.student_details_id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Failed to prepare SQL statement: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database query preparation failed."]);
    exit;
}

$stmt->bind_param("i", $student_details_id); 
$stmt->execute();
$result = $stmt->get_result();

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

if (empty($courses)) {
    echo json_encode(["success" => false, "message" => "No courses found for this student."]);
} else {
    echo json_encode(["success" => true, "courses" => $courses]);
}

$stmt->close();
$conn->close();
?>
