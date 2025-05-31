<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Include the database connection file
require_once('../src/conn.php');

// Enable error reporting for debugging purposes.
// In a production environment, these should be disabled or logged to a file.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if the database connection was successful
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Decode the JSON input received from the client
$data = json_decode(file_get_contents("php://input"), true);

// Extract and sanitize input data
$section_id = isset($data['section_id']) ? (int)$data['section_id'] : 0;
$date = isset($data['date']) ? $data['date'] : null;
$submitted_passcode = isset($data['passcode']) ? trim($data['passcode']) : '';
$instructor_id = isset($data['instructor_id']) ? (int)$data['instructor_id'] : 0; // Added to get instructor_id

// Validate essential input fields, now including instructor_id
if (!$section_id || !$date || !$submitted_passcode || !$instructor_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields (section_id, date, passcode, or instructor_id).']);
    exit;
}

// --- Fetch the expected password from the instructor table ---
$getPasscodeQuery = "SELECT password FROM instructor WHERE instructor_id = ?";
$stmt_passcode = $conn->prepare($getPasscodeQuery);

if ($stmt_passcode === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare password retrieval statement: ' . $conn->error]);
    exit;
}

$stmt_passcode->bind_param("i", $instructor_id);
$stmt_passcode->execute();
$result_passcode = $stmt_passcode->get_result();

if ($result_passcode->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Instructor not found.']);
    $stmt_passcode->close();
    $conn->close();
    exit;
}

$instructor_data = $result_passcode->fetch_assoc();
$expected_passcode_hash = $instructor_data['password']; // This should be the hashed password

// --- IMPORTANT: Use password_verify() if your passwords are hashed! ---
if (!password_verify($submitted_passcode, $expected_passcode_hash)) {
    echo json_encode(['success' => false, 'message' => 'Invalid passcode.']);
    $stmt_passcode->close();
    $conn->close();
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