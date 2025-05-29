<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

define('LOG_PREFIX', '[ATTENDANCE_API_ABSENT]');

require_once("../../src/conn.php");

if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
error_log(LOG_PREFIX . " Received raw input: " . print_r($input, true));

if (!isset($input['student_id']) || !isset($input['course_id'])) {
    error_log(LOG_PREFIX . " Error: Missing student_id or course_id in request input.");
    echo json_encode(["error" => "Missing student_id or course_id"]);
    exit;
}

$student_id = $input['student_id'];
$course_id = $input['course_id'];
$year = (int) date("Y");

error_log(LOG_PREFIX . " Processing request for student_id: '{$student_id}', course_id: '{$course_id}' for year: {$year}");

$sql = "
    SELECT COUNT(a.attendance_id) AS total_absent
    FROM attendance a
    INNER JOIN student_details sd ON a.student_details_id = sd.student_details_id
    INNER JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
    INNER JOIN course c ON sc.course_id = c.course_id
    WHERE sd.student_id = ? 
      AND c.course_id = ? 
      AND a.status = 'Absent'
      AND YEAR(a.date) = ?
";

if (!$stmt = $conn->prepare($sql)) {
    error_log(LOG_PREFIX . " Failed to prepare statement. MySQL Error: " . $conn->error);
    echo json_encode(["error" => "SQL prepare failed", "mysql_error" => $conn->error]);
    exit;
}

$stmt->bind_param("sii", $student_id, $course_id, $year);

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
