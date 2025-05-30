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

if (!isset($_GET['student_id'])) { // Change parameter name to student_id
    echo json_encode(["success" => false, "message" => "Missing student_id"]);
    exit;
}

$studentId = $_GET['student_id']; // Use studentId

// --- ADJUSTMENT HERE: Add sd.student_details_id to the SELECT statement ---
$sql = "SELECT DISTINCT c.course_id, c.course_name, sd.student_details_id 
        FROM student_details sd
        JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
        JOIN course c ON sc.course_id = c.course_id
        WHERE sd.student_id = ?"; // Filter by student_id from student_details table

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $studentId); // Bind studentId
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
?>