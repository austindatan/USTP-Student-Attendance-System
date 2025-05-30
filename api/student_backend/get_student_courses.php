<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

include __DIR__ . '/../../src/conn.php';

if (!isset($_GET['student_details_id'])) {
    echo json_encode(["success" => false, "message" => "Missing student_details_id"]);
    exit;
}

$studentDetailsId = $_GET['student_details_id'];

$sql = "SELECT c.course_id, c.course_name
        FROM student_details sd
        JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
        JOIN course c ON sc.course_id = c.course_id
        WHERE sd.student_details_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $studentDetailsId);
$stmt->execute();
$result = $stmt->get_result();

$courses = [];

while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

if (count($courses) > 0) {
    echo json_encode([
        "success" => true,
        "courses" => $courses
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No courses found"
    ]);
}

$stmt->close();
$conn->close();