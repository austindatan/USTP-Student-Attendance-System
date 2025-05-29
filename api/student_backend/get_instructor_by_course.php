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

$student_details_id = $_GET['student_details_id'] ?? null;
$course_id          = $_GET['course_id']          ?? null;

if (!$student_details_id || !$course_id) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$sql = "
SELECT i.firstname, i.lastname
FROM   student_details sd
JOIN   instructor      i ON sd.instructor_id = i.instructor_id
JOIN   section         s ON sd.section_id    = s.section_id
WHERE  sd.student_details_id = ?
  AND  s.course_id           = ?
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log("Failed to prepare SQL statement: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database query preparation failed."]);
    exit;
}

$stmt->bind_param("ii", $student_details_id, $course_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $instructor_name = $row['firstname'] . ' ' . $row['lastname'];
    echo json_encode(["success" => true, "instructor_name" => $instructor_name]);
} else {
    echo json_encode(["success" => false, "message" => "Instructor not found for this course and student."]);
}

$stmt->close();
$conn->close();
?>
