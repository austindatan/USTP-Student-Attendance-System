<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($conn->connect_error) {
    error_log("SaveAttendance.php: Database connection failed: " . $conn->connect_error);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$rawInput = file_get_contents("php://input");
error_log("SaveAttendance.php: Raw PHP input: " . $rawInput);

$data = json_decode($rawInput, true);
error_log("SaveAttendance.php: Decoded data (print_r): " . print_r($data, true));

if (json_last_error() !== JSON_ERROR_NONE) {
    $jsonErrorMsg = json_last_error_msg();
    error_log("SaveAttendance.php: JSON decode error: " . $jsonErrorMsg);
    echo json_encode(['success' => false, 'message' => 'JSON decode error: ' . $jsonErrorMsg]);
    exit;
}

$student_details_id = isset($data['student_details_id']) ? (int)$data['student_details_id'] : 0;
$date = isset($data['date']) ? $data['date'] : null;
$status = isset($data['status']) ? $data['status'] : null;
$section_id = isset($data['section_id']) ? (int)$data['section_id'] : 0;
$course_id = isset($data['course_id']) ? (int)$data['course_id'] : 0; // ADD THIS LINE: Receive course_id from frontend

error_log("SaveAttendance.php: student_details_id = " . $student_details_id);
error_log("SaveAttendance.php: date = " . ($date ?? 'null'));
error_log("SaveAttendance.php: status = " . ($status ?? 'null'));
error_log("SaveAttendance.php: section_id = " . $section_id);
error_log("SaveAttendance.php: course_id = " . $course_id); // Log course_id

// Basic validation for required fields
if (!$date || !$status || !$student_details_id || !$section_id || !$course_id) { // ADD course_id to check
    $missingFields = [];
    if (!$student_details_id) $missingFields[] = 'student_details_id (value: ' . $student_details_id . ')';
    if (!$date) $missingFields[] = 'date (value: ' . ($date ?? 'null') . ')';
    if (!$status) $missingFields[] = 'status (value: ' . ($status ?? 'null') . ')';
    if (!$section_id) $missingFields[] = 'section_id (value: ' . $section_id . ')';
    if (!$course_id) $missingFields[] = 'course_id (value: ' . $course_id . ')'; // Add missing field for course_id

    $errorMessage = 'Missing required fields: ' . implode(', ', $missingFields) . '.';
    error_log("SaveAttendance.php: " . $errorMessage);
    echo json_encode(['success' => false, 'message' => $errorMessage]);
    exit;
}

// --- CHECK IF ATTENDANCE IS LOCKED FOR THIS SPECIFIC SECTION, COURSE, AND DATE ---
$checkLockQuery = "SELECT a.is_locked FROM attendance a
                   JOIN student_details sd ON a.student_details_id = sd.student_details_id
                   JOIN SectionCourses sc ON sd.section_course_id = sc.section_course_id
                   WHERE sc.section_id = ?
                   AND sc.course_id = ?  -- ADD THIS LINE: Filter by course_id
                   AND a.date = ? AND a.is_locked = 1 LIMIT 1";

$lockStmt = $conn->prepare($checkLockQuery);
if ($lockStmt === false) {
    error_log("SaveAttendance.php: Failed to prepare lock check statement: " . $conn->error);
    echo json_encode(['success' => false, 'message' => 'Failed to prepare lock check statement: ' . $conn->error]);
    exit;
}
$lockStmt->bind_param("iis", $section_id, $course_id, $date); // ADD course_id to bind_param
$lockStmt->execute();
$lockResult = $lockStmt->get_result();

if ($lockResult->num_rows > 0) {
    error_log("SaveAttendance.php: Attendance locked for section " . $section_id . ", course " . $course_id . " on " . $date . ".");
    echo json_encode(['success' => false, 'message' => 'Attendance for this section and date is locked and cannot be modified.']);
    $lockStmt->close();
    $conn->close();
    exit;
}
$lockStmt->close();
// --- END LOCK CHECK ---


// Existing logic for attendance table (no changes needed here for course_id, as it's per student_details_id)
$checkQuery = "SELECT 1 FROM attendance WHERE student_details_id = ? AND date = ?";
$stmt = $conn->prepare($checkQuery);
if ($stmt === false) {
    error_log("SaveAttendance.php: Failed to prepare check statement: " . $conn->error);
    echo json_encode(['success' => false, 'message' => 'Failed to prepare check statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("is", $student_details_id, $date);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $updateQuery = "UPDATE attendance SET status = ? WHERE student_details_id = ? AND date = ?";
    $updateStmt = $conn->prepare($updateQuery);
    if ($updateStmt === false) {
        error_log("SaveAttendance.php: Failed to prepare update statement: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Failed to prepare update statement: ' . $conn->error]);
    }
    $updateStmt->bind_param("sis", $status, $student_details_id, $date);
    if ($updateStmt->execute()) {
        error_log("SaveAttendance.php: Attendance updated successfully for student " . $student_details_id . ".");
        echo json_encode(['success' => true, 'action' => 'updated']);
    } else {
        error_log("SaveAttendance.php: Failed to update attendance: " . $updateStmt->error);
        echo json_encode(['success' => false, 'message' => 'Failed to update attendance: ' . $updateStmt->error]);
    }
    $updateStmt->close();
} else {
    $insertQuery = "INSERT INTO attendance (student_details_id, date, status) VALUES (?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    if ($insertStmt === false) {
        error_log("SaveAttendance.php: Failed to prepare insert statement: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Failed to prepare insert statement: ' . $conn->error]);
        exit;
    }
    $insertStmt->bind_param("iss", $student_details_id, $date, $status);
    if ($insertStmt->execute()) {
        error_log("SaveAttendance.php: Attendance inserted successfully for student " . $student_details_id . ".");
        echo json_encode(['success' => true, 'action' => 'inserted']);
    } else {
        error_log("SaveAttendance.php: Failed to insert attendance: " . $insertStmt->error);
        echo json_encode(['success' => false, 'message' => 'Failed to insert attendance: ' . $insertStmt->error]);
    }
    $insertStmt->close();
}

$stmt->close();
$conn->close();
error_log("SaveAttendance.php: Script finished.");
?>