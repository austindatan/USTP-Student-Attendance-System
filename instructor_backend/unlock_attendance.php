<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once('../src/conn.php');

$data = json_decode(file_get_contents("php://input"), true);

$section_id = isset($data['section_id']) ? (int)$data['section_id'] : 0;
$date = isset($data['date']) ? $data['date'] : null;
$passcode = isset($data['passcode']) ? trim($data['passcode']) : '';

$EXPECTED_PASSCODE = '1234'; // 🔐 Replace this with secure value or verify from DB

if (!$section_id || !$date || $passcode !== $EXPECTED_PASSCODE) {
    echo json_encode(['success' => false, 'message' => 'Missing fields or invalid passcode.']);
    exit;
}

$updateQuery = "UPDATE attendance a
                JOIN student_details sd ON a.student_details_id = sd.student_details_id
                SET a.is_locked = 0
                WHERE sd.section_id = ? AND a.date = ?";

$stmt = $conn->prepare($updateQuery);
$stmt->bind_param("is", $section_id, $date);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Attendance unlocked.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Unlock failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
