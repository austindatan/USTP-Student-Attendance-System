<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: *");

$conn = new mysqli("localhost", "root", "austinreverie", "attendance_monitoring");

$data = json_decode(file_get_contents('php://input'), true);
$section_id = $data['section_id'] ?? null;
$hexcode = $data['hexcode'] ?? null;

if (!$section_id || !$hexcode) {
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
    exit;
}

$stmt = $conn->prepare("UPDATE section SET hexcode = ? WHERE section_id = ?");
$stmt->bind_param("ss", $hexcode, $section_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

?>
