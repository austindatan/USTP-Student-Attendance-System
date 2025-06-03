<?php

header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json'); 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../../src/conn.php'; 

$data = json_decode(file_get_contents("php://input"), true);

$sectionCourseId = isset($data['section_course_id']) ? intval($data['section_course_id']) : 0;

if ($sectionCourseId === 0) {
    die(json_encode(["success" => false, "message" => "Section Course ID is required for deletion."]));
}

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