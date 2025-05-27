<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

define('LOG_PREFIX', '[ATTENDANCE_API]');

// Adjust this path according to your actual file structure
require_once("../../src/conn.php");

if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
error_log(LOG_PREFIX . " Received raw input: " . print_r($input, true));

if (!isset($input['student_id'])) {
    error_log(LOG_PREFIX . " Error: Missing student_id in request input.");
    echo json_encode(["error" => "Missing student_id"]);
    exit;
}

$student_id = $input['student_id'];
$year = (int) date("Y");

error_log(LOG_PREFIX . " Processing request for student_id: '{$student_id}' for year: {$year}");

// Make sure these column and table names exactly exist in your DB
$sql = "
    SELECT COUNT(a.attendance_id) AS total_present
    FROM attendance a
    INNER JOIN student_details sd ON a.student_details_id = sd.student_details_id
    INNER JOIN student s ON sd.student_id = s.student_id
    WHERE s.student_id = ?
    AND a.status = 'Present'
    AND YEAR(a.date) = ?
";

// Check if prepare returns false
if (!$stmt = $conn->prepare($sql)) {
    error_log(LOG_PREFIX . " Failed to prepare statement. MySQL Error: " . $conn->error);
    echo json_encode(["error" => "SQL prepare failed", "mysql_error" => $conn->error]);
    exit;
}

$stmt->bind_param("si", $student_id, $year);

if (!$stmt->execute()) {
    error_log(LOG_PREFIX . " Failed to execute statement. Error: " . $stmt->error);
    echo json_encode(["error" => "SQL execute failed", "mysql_error" => $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

$result = $stmt->get_result();

if ($result && $row = $result->fetch_assoc()) {
    $total_present = (int) $row['total_present'];
    echo json_encode(["total_present" => $total_present]);
} else {
    echo json_encode(["total_present" => 0]);
}

$stmt->close();
$conn->close();
?>