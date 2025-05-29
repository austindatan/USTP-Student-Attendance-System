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

// Extract all fields
$section_name = $data['section_name'] ?? null;
$course_id = $data['course_id'] ?? null;
$schedule_day = $data['schedule_day'] ?? null;
$start_time = $data['start_time'] ?? null;
$end_time = $data['end_time'] ?? null;
$year_level_id = $data['year_level_id'] ?? null;
$semester_id = $data['semester_id'] ?? null;

// Validate incoming data (basic check for null values)
if (is_null($section_name) || is_null($course_id) || is_null($schedule_day) ||
    is_null($start_time) || is_null($end_time) || is_null($year_level_id) ||
    is_null($semester_id)) {
    error_log("Missing required data in section_add.php. Received: " . print_r($data, true));
    echo json_encode(["success" => false, "message" => "Missing required data for section creation or course/schedule linkage."]);
    exit();
}

// Start a transaction
$conn->begin_transaction();

try {
    // 1. Insert into the 'section' table
    $stmt_section = $conn->prepare("INSERT INTO section (section_name, year_level_id, semester_id) VALUES (?, ?, ?)");
    if ($stmt_section === false) {
        throw new Exception("Failed to prepare section insert statement: " . $conn->error);
    }
    $stmt_section->bind_param("sii", $section_name, $year_level_id, $semester_id);
    if (!$stmt_section->execute()) {
        throw new Exception("Failed to add section: " . $stmt_section->error);
    }
    $new_section_id = $conn->insert_id; // Get the ID of the newly inserted section
    $stmt_section->close();

    // 2. Insert into the 'section_courses' table
    $stmt_section_courses = $conn->prepare("INSERT INTO section_courses (section_id, course_id, schedule_day, start_time, end_time) VALUES (?, ?, ?, ?, ?)");
    if ($stmt_section_courses === false) {
        throw new Exception("Failed to prepare section_courses insert statement: " . $conn->error);
    }
    $stmt_section_courses->bind_param("iisss", $new_section_id, $course_id, $schedule_day, $start_time, $end_time);
    if (!$stmt_section_courses->execute()) {
        throw new Exception("Failed to link section with course and schedule: " . $stmt_section_courses->error);
    }
    $stmt_section_courses->close();

    // Commit the transaction if all operations were successful
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Section and its course/schedule added successfully!", "section_id" => $new_section_id]);

} catch (Exception $e) {
    // Rollback the transaction on error
    $conn->rollback();
    error_log("Transaction failed in section_add.php: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Error adding section: " . $e->getMessage()]);
} finally {
    if ($conn) {
        $conn->close();
    }
}

?>