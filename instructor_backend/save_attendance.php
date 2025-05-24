<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'attendance_monitoring';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$student_id = isset($data['student_id']) ? (int)$data['student_id'] : 0;
$instructor_id = isset($data['instructor_id']) ? (int)$data['instructor_id'] : 0;
$section_id = isset($data['section_id']) ? (int)$data['section_id'] : 0;
$program_details_id = isset($data['program_details_id']) ? (int)$data['program_details_id'] : 0;
$admin_id = isset($data['admin_id']) ? (int)$data['admin_id'] : 0;
$date = isset($data['date']) ? $data['date'] : null;
$status = isset($data['status']) ? $data['status'] : null;

if (!$date || !$status || !$student_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Check if attendance for this student on this date already exists
$checkQuery = "SELECT 1 FROM attendance WHERE student_id = ? AND date = ?";
$stmt = $conn->prepare($checkQuery);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}
$stmt->bind_param("is", $student_id, $date);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Update existing record
    $updateQuery = "UPDATE attendance SET status = ? WHERE student_id = ? AND date = ?";
    $updateStmt = $conn->prepare($updateQuery);
    if (!$updateStmt) {
        echo json_encode(['success' => false, 'message' => 'Update prepare failed: ' . $conn->error]);
        exit;
    }
    $updateStmt->bind_param("sis", $status, $student_id, $date);
    $exec = $updateStmt->execute();
    if (!$exec) {
        echo json_encode(['success' => false, 'message' => 'Update execute failed: ' . $updateStmt->error]);
        exit;
    }
    echo json_encode(['success' => true, 'action' => 'updated']);
    $updateStmt->close();
} else {
    
    // Insert new record
    $insertQuery = "INSERT INTO attendance (student_id, instructor_id, section_id, program_details_id, admin_id, date, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    if (!$insertStmt) {
        echo json_encode(['success' => false, 'message' => 'Insert prepare failed: ' . $conn->error]);
        exit;
    }
    $insertStmt->bind_param("iiiiiss", $student_id, $instructor_id, $section_id, $program_details_id, $admin_id, $date, $status);
    $exec = $insertStmt->execute();
    if (!$exec) {
        echo json_encode(['success' => false, 'message' => 'Insert execute failed: ' . $insertStmt->error]);
        exit;
    }
    echo json_encode(['success' => true, 'action' => 'inserted']);
    $insertStmt->close();
}

$stmt->close();
$conn->close();
?>
