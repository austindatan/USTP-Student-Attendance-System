<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

define('LOG_PREFIX', '[ATTENDANCE_API_EXCUSED]'); // Changed LOG_PREFIX

// Adjust this path if 'conn.php' is not two directories up from 'get_class_excused.php'
require_once(__DIR__ . "/../../src/conn.php");

if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

if (!isset($_GET['student_id']) || !isset($_GET['course_code'])) {
    error_log(LOG_PREFIX . " Error: Missing student_id or course_code in request input.");
    echo json_encode(["error" => "Missing student_id or course_code"]);
    exit;
}

$student_id = $_GET['student_id'];
$course_code = $_GET['course_code'];
$year = (int) date("Y");

error_log(LOG_PREFIX . " Processing request for student_id: '{$student_id}', course_code: '{$course_code}' for year: {$year}");

$sql = "
    SELECT COUNT(a.attendance_id) AS total_excused 
    FROM attendance a
    INNER JOIN student_details sd ON a.student_details_id = sd.student_details_id
    INNER JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
    INNER JOIN course c ON sc.course_id = c.course_id
    WHERE sd.student_id = ?
      AND c.course_code = ?
      AND a.status = 'Excused' 
      AND YEAR(a.date) = ?
";

if (!$stmt = $conn->prepare($sql)) {
    error_log(LOG_PREFIX . " Failed to prepare statement. MySQL Error: " . $conn->error);
    echo json_encode(["error" => "SQL prepare failed", "mysql_error" => $conn->error]);
    exit;
}

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
    $total_excused = (int) $row['total_excused']; // Changed variable name
    echo json_encode(["total_excused" => $total_excused]); // Changed JSON key
} else {
    echo json_encode(["total_excused" => 0]); // Changed JSON key
}

$stmt->close();
$conn->close();
?>