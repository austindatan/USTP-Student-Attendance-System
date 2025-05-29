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

// Debugging: Check if JSON decoding failed or data is missing
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON Decode Error: " . json_last_error_msg());
    echo json_encode(["success" => false, "message" => "Invalid JSON format received."]);
    exit();
}
if ($data === null) {
    error_log("Received null data after JSON decode. Empty POST body?");
    echo json_encode(["success" => false, "message" => "No data received or invalid JSON format."]);
    exit();
}

// Extract all fields, including the new ones (now IDs)
$section_name = $data['section_name'] ?? null;
$course_id = $data['course_id'] ?? null;
$schedule_day = $data['schedule_day'] ?? null;
$start_time = $data['start_time'] ?? null;
$end_time = $data['end_time'] ?? null;
$year_level_id = $data['year_level_id'] ?? null; // Expecting an ID (integer)
$semester_id = $data['semester_id'] ?? null;   // Expecting an ID (integer)


// Validate incoming data (basic check for null values)
if (is_null($section_name) || is_null($course_id) || is_null($schedule_day) ||
    is_null($start_time) || is_null($end_time) || is_null($year_level_id) ||
    is_null($semester_id)) {
    error_log("Missing required data in section_add.php. Received: " . print_r($data, true));
    echo json_encode(["success" => false, "message" => "Missing required data for section creation."]);
    exit();
}

// Prepare an insert statement with the new columns for IDs
$stmt = $conn->prepare("INSERT INTO section (section_name, course_id, schedule_day, start_time, end_time, year_level_id, semester_id) VALUES (?, ?, ?, ?, ?, ?, ?)");

// Bind parameters, including the new ones (now integers)
// "siissss" -> section_name (s), course_id (i), schedule_day (s), start_time (s), end_time (s), year_level_id (i), semester_id (i)
// Wait, course_id is integer. So year_level_id and semester_id should also be 'i' if they are INT in DB.
// "s i s s s i i"
if ($stmt) {
    $stmt->bind_param("sisssii", $section_name, $course_id, $schedule_day, $start_time, $end_time, $year_level_id, $semester_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Section added successfully!"]);
    } else {
        error_log("Error adding section: " . $stmt->error);
        echo json_encode(["success" => false, "message" => "Failed to add section. Please try again."]);
    }

    $stmt->close();
} else {
    error_log("Failed to prepare statement: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database error: Could not prepare statement."]);
}

$conn->close();

?>