<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: *");

include __DIR__ . '/../../src/conn.php'; 

$data = json_decode(file_get_contents('php://input'), true);
$section_course_id = $data['section_course_id'] ?? null;
$hexcode = $data['hexcode'] ?? null;

// Ensures section_course_id is present
if (!$section_course_id || !$hexcode) {
    echo json_encode(['success' => false, 'error' => 'Missing parameters (section_course_id or hexcode)']);
    exit;
}

$stmt = $conn->prepare("UPDATE section_courses SET hexcode = ? WHERE section_course_id = ?");
$stmt->bind_param("si", $hexcode, $section_course_id); 

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>