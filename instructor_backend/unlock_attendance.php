<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once('../src/conn.php');

// Enable error reporting for debugging
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
$passcode = isset($data['passcode']) ? trim($data['passcode']) : '';

$EXPECTED_PASSCODE = '1234'; // 🔐 Replace this with secure value or verify from DB

if (!$section_id || !$date || $passcode !== $EXPECTED_PASSCODE) {
    echo json_encode(['success' => false, 'message' => 'Missing fields or invalid passcode.']);
    exit;
}

// Updated query to use section_courses for filtering by section_id
$updateQuery = "UPDATE attendance a
                JOIN student_details sd ON a.student_details_id = sd.student_details_id
                JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
                SET a.is_locked = 0
                WHERE sc.section_id = ? AND a.date = ?";

$stmt = $conn->prepare($updateQuery);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare unlock statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("is", $section_id, $date);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Attendance unlocked.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Unlock failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>