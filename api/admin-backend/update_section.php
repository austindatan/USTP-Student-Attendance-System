<?php

header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include __DIR__ . '/../../src/conn.php'; 

$data = json_decode(file_get_contents("php://input"));

$section_id = $data->section_id ?? null;
$section_name = $data->section_name ?? '';
$year_level_id = $data->year_level_id ?? null; 
$semester_id = $data->semester_id ?? null;

if (!$section_id) {
    echo json_encode(["success" => false, "message" => "Section ID is missing."]);
    exit;
}

$sql = "UPDATE section SET section_name = ?, year_level_id = ?, semester_id = ? WHERE section_id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log("Failed to prepare statement in update_section.php: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database error: Could not prepare statement."]);
    exit;
}

$stmt->bind_param("siii", $section_name, $year_level_id, $semester_id, $section_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Section updated successfully."]);
    } else {
        echo json_encode(["success" => true, "message" => "No changes made or section not found."]);
    }
} else {
    error_log("Error executing statement in update_section.php: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Update failed."]);
}

$stmt->close();
$conn->close();
?>