<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include __DIR__ . '/../../src/conn.php'; 

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

// Extract only the fields relevant for the 'section' table
$section_name = $data['section_name'] ?? null;
$year_level_id = $data['year_level_id'] ?? null;
$semester_id = $data['semester_id'] ?? null;

// Validate incoming data (basic check for null values for section creation)
if (is_null($section_name) || is_null($year_level_id) || is_null($semester_id)) {
    error_log("Missing required data in SectionAdd.php. Received: " . print_r($data, true));
    echo json_encode(["success" => false, "message" => "Missing required data for section creation (Section Name, Year Level, Semester)."]);
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

    // The SectionCourses insertion with course_id, schedule_day, start_time, end_time is REMOVED.
    // If you need to link Courses to Sections, you'll need a separate process for that.

    // Commit the transaction if all operations were successful
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Section added successfully!", "section_id" => $new_section_id]);

} catch (Exception $e) {
    // Rollback the transaction on error
    $conn->rollback();
    error_log("Transaction failed in SectionAdd.php: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Error adding section: " . $e->getMessage()]);
} finally {
    if ($conn) {
        $conn->close();
    }
}

?>