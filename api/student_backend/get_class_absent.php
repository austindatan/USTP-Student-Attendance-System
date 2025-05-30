<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

define('LOG_PREFIX', '[ATTENDANCE_API_ABSENT]');

// Adjust this path if 'conn.php' is not two directories up from 'get_class_absent.php'
require_once(__DIR__ . "/../../src/conn.php");

if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Changed to $_GET for GET parameters
if (!isset($_GET['student_id']) || !isset($_GET['course_code'])) {
    error_log(LOG_PREFIX . " Error: Missing student_id or course_code in request input.");
    echo json_encode(["error" => "Missing student_id or course_code"]);
    exit;
}

$student_id = $_GET['student_id'];
$course_code = $_GET['course_code']; // Get course_code from GET
$year = (int) date("Y"); // Assuming current year attendance

error_log(LOG_PREFIX . " Processing request for student_id: '{$student_id}', course_code: '{$course_code}' for year: {$year}");

$sql = "
    SELECT COUNT(a.attendance_id) AS total_absent
    FROM attendance a
    INNER JOIN student_details sd ON a.student_details_id = sd.student_details_id
    INNER JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
    INNER JOIN course c ON sc.course_id = c.course_id
    WHERE sd.student_id = ?
      AND c.course_code = ?  -- Changed to filter by course_code
      AND a.status = 'Absent'
      AND YEAR(a.date) = ?
";

if (!$stmt = $conn->prepare($sql)) {
    error_log(LOG_PREFIX . " Failed to prepare statement. MySQL Error: " . $conn->error);
    echo json_encode(["error" => "SQL prepare failed", "mysql_error" => $conn->error]);
    exit;
}

// Bind parameters: 's' for student_id (string), 's' for course_code (string), 'i' for year (integer)
$stmt->bind_param("ssi", $student_id, $course_code, $year);

if (!$stmt->execute()) {
    error_log(LOG_PREFIX . " Failed to execute statement. Error: " . $stmt->error);
    echo json_encode(["error" => "SQL execute failed", "mysql_error" => $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

$result = $stmt->get_result();

if ($result && $row = $result->fetch_assoc()) {
    $total_absent = (int) $row['total_absent'];
    echo json_encode(["total_absent" => $total_absent]);
} else {
    echo json_encode(["total_absent" => 0]);
}

$stmt->close();
$conn->close();
?>