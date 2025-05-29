<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include __DIR__ . '/../src/conn.php';

$section_id = $_GET['section_id'] ?? null;

if (!$section_id) {
    error_log("Error in get_single_section.php: Section ID not provided in GET request.");
    echo json_encode(["success" => false, "message" => "Section ID is required."]);
    exit;
}

$sql = "SELECT section_id, section_name, course_id, schedule_day, start_time, end_time FROM section WHERE section_id = ?"; // Assuming 'section' table
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log("Error preparing statement in get_single_section.php: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database prepare failed."]);
    exit;
}

$stmt->bind_param("i", $section_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "section" => $row]);
} else {
    error_log("Error in get_single_section.php: Section not found for ID " . $section_id);
    echo json_encode(["success" => false, "message" => "Section not found."]);
}

$stmt->close();
$conn->close();
?>