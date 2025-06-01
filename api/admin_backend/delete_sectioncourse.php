<?php
// delete_sectioncourse.php

// Set CORS headers to allow requests from your React app's origin
header("Access-Control-Allow-Origin: http://localhost:3000"); // Specify the exact origin of your React app
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE"); // Allow necessary HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow necessary headers
header('Content-Type: application/json'); // Indicate JSON response

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include the database connection file
// Adjust the path if your conn.php is located differently relative to admin_backend
include __DIR__ . '/../src/conn.php';

// Get the posted data (for DELETE requests, often sent as POST with _method: 'DELETE')
$data = json_decode(file_get_contents("php://input"), true);

$sectionCourseId = isset($data['section_course_id']) ? intval($data['section_course_id']) : 0;

if ($sectionCourseId === 0) {
    die(json_encode(["success" => false, "message" => "Section Course ID is required for deletion."]));
}

// SQL query to delete the section course
// Assuming 'conn' is the mysqli connection object from conn.php
$sql = "DELETE FROM section_courses WHERE section_course_id = ?";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    die(json_encode(["success" => false, "message" => "Failed to prepare statement: " . $conn->error]));
}

$stmt->bind_param("i", $sectionCourseId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Section course deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "No course found with the provided ID in this section."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error deleting section course: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>