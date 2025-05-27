<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include __DIR__ . '/../src/conn.php'; 


$data = json_decode(file_get_contents("php://input"), true);

$section_name = $data['section_name'];
$course_id = $data['course_id'];
$schedule_day = $data['schedule_day'];
$start_time = $data['start_time'];
$end_time = $data['end_time'];

$stmt = $conn->prepare("INSERT INTO section (section_name, course_id, schedule_day, start_time, end_time) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sisss", $section_name, $course_id, $schedule_day, $start_time, $end_time);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Section added successfully!"]);
} else {
    error_log("Error adding section: " . $stmt->error); 
    echo json_encode(["success" => false, "message" => "Failed to add section. Please try again."]);
}

$stmt->close();
$conn->close();

?>