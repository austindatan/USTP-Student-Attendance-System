<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include __DIR__ . '/../../src/conn.php'; 

$data = json_decode(file_get_contents("php://input"), true);

if (json_last_error() !== JSON_ERROR_NONE || $data === null) {
    error_log("JSON Decode Error or null data in LinkSectionToCourse.php: " . json_last_error_msg());
    echo json_encode(["success" => false, "message" => "Invalid JSON format or no data received."]);
    exit();
}

// Extract fields for SectionCourses
$section_id = $data['section_id'] ?? null;
$course_id = $data['course_id'] ?? null;
$schedule_day = $data['schedule_day'] ?? null;
$start_time = $data['start_time'] ?? null;
$end_time = $data['end_time'] ?? null;

// Validate incoming data
if (is_null($section_id) || is_null($course_id) || is_null($schedule_day) ||
    is_null($start_time) || is_null($end_time)) {
    error_log("Missing required data in LinkSectionToCourse.php. Received: " . print_r($data, true));
    echo json_encode(["success" => false, "message" => "Missing required data to link section to course."]);
    exit();
}

// Prepare and execute insert statement for SectionCourses
$stmt = $conn->prepare("INSERT INTO SectionCourses (section_id, course_id, schedule_day, start_time, end_time) VALUES (?, ?, ?, ?, ?)");

if ($stmt === false) {
    error_log("Failed to prepare statement in LinkSectionToCourse.php: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database error: Could not prepare statement."]);
    exit();
}

$stmt->bind_param("iisss", $section_id, $course_id, $schedule_day, $start_time, $end_time);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Section linked to course successfully!"]);
} else {
    error_log("Error linking section to course: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Failed to link section to course. Please try again. Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();

?>