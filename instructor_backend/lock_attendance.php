<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once('../src/conn.php'); // Ensure this path is correct relative to lock_attendance.php

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
$lock_status = isset($data['lock_status']) ? (int)$data['lock_status'] : null; // Get lock_status (0 for unlock, 1 for lock)

if (!$section_id || !$date || $lock_status === null) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields (section_id, date, lock_status).']);
    exit;
}

// Update all attendance records for students in this section and date
// This query joins with student_details to filter by section_id
// And sets the is_locked column to the received lock_status
$updateLockStatusQuery = "UPDATE attendance a
                          JOIN student_details sd ON a.student_details_id = sd.student_details_id
                          SET a.is_locked = ?
                          WHERE sd.section_id = ? AND a.date = ?";

$stmt = $conn->prepare($updateLockStatusQuery);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare lock/unlock statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("iis", $lock_status, $section_id, $date); // Bind lock_status (integer), section_id (integer), date (string)

if ($stmt->execute()) {
    $action = ($lock_status == 1) ? 'locked' : 'unlocked';
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Attendance ' . $action . ' successfully for section ' . $section_id . ' on ' . $date . ' (' . $stmt->affected_rows . ' records updated).']);
    } else {
        echo json_encode(['success' => true, 'message' => 'No existing attendance records found to ' . $action . ' for section ' . $section_id . ' on ' . $date . '.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to ' . (($lock_status == 1) ? 'lock' : 'unlock') . ' attendance: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
