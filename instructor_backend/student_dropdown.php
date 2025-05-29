<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . '/../src/conn.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$instructor_id = $_GET['instructor_id'] ?? null;
$section_id = $_GET['section_id'] ?? null;

if (!$instructor_id || !$section_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing instructor_id or section_id']);
    exit;
}

$sql = "SELECT student_details.student_details_id, 
               CONCAT(student.firstname, ' ', student.middlename, ' ', student.lastname) AS student_name 
        FROM student_details
        INNER JOIN student ON student.student_id = student_details.student_id
        WHERE student_details.instructor_id = ?
          AND student_details.section_id = ?
          AND student_details.student_details_id NOT IN (
              SELECT student_details_id 
              FROM drop_request 
              WHERE status = 'Dropped'
          )";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ii", $instructor_id, $section_id);
$stmt->execute();
$result = $stmt->get_result();

$students = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

echo json_encode($students);

$stmt->close();
$conn->close();
?>
