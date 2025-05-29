<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include __DIR__ . '/../src/conn.php';

$data = json_decode(file_get_contents("php://input"));

$section_id = $data->section_id ?? null;
$section_name = $data->section_name ?? '';
$course_id = $data->course_id ?? '';
$schedule_day = $data->schedule_day ?? '';
$start_time = $data->start_time ?? '';
$end_time = $data->end_time ?? '';

if (!$section_id) {
    echo json_encode(["success" => false, "message" => "Section ID is missing."]);
    exit;
}

$sql = "UPDATE section SET section_name = ?, course_id = ?, schedule_day = ?, start_time = ?, end_time = ? WHERE section_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sisssi", $section_name, $course_id, $schedule_day, $start_time, $end_time, $section_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Section updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed."]);
}
?>
