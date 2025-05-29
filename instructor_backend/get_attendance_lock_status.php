<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once('../src/conn.php'); // Ensure this path is correct relative to get_attendance_lock_status.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$section_id = isset($data['section_id']) ? (int)$data['section_id'] : 0;
$date = isset($data['date']) ? $data['date'] : null;

if (!$section_id || !$date) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields (section_id, date).', 'is_locked' => false]);
    exit;
}

// Check if ANY attendance record for this section and date is locked
// This query now joins with student_details and section_courses to filter by section_id
$checkLockQuery = "SELECT a.is_locked
                   FROM attendance a
                   JOIN student_details sd ON a.student_details_id = sd.student_details_id
                   JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
                   WHERE sc.section_id = ? AND a.date = ? AND a.is_locked = 1
                   LIMIT 1"; // Only need one to determine locked status

$stmt = $conn->prepare($checkLockQuery);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare lock status statement: ' . $conn->error, 'is_locked' => false]);
    exit;
}
$stmt->bind_param("is", $section_id, $date);
$stmt->execute();
$result = $stmt->get_result();

$is_locked_status = false;
if ($result->num_rows > 0) {
    // If we get any row, it means at least one record is locked for this section/date
    // So, we consider the whole session attendance locked.
    $is_locked_status = true;
}

echo json_encode(['success' => true, 'is_locked' => $is_locked_status]);

$stmt->close();
$conn->close();
?>