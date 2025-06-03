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

if (!isset($_GET['student_id']) || !isset($_GET['course_id'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$studentId = $_GET['student_id'];
$courseId = $_GET['course_id'];

$sql = "SELECT i.instructor_id, i.firstname, i.lastname
        FROM student_details sd
        JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
        JOIN instructor i ON sc.instructor_id = i.instructor_id
        WHERE sd.student_id = ? AND sc.course_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $studentId, $courseId);
$stmt->execute();
$result = $stmt->get_result();

$instructor = $result->fetch_assoc();

if ($instructor) {
    echo json_encode([
        "success" => true,
        "instructor" => $instructor
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Instructor not found for this student and course combination."
    ]);
}

$stmt->close();
$conn->close();
?>