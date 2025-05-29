<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS'); // Add POST
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// Accept POST with _method override
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$method = $_SERVER['REQUEST_METHOD'];
$override = $data['_method'] ?? null;

if (!($method === 'POST' && $override === 'DELETE')) {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed. Use POST with _method DELETE."]);
    exit();
}

include __DIR__ . '/../src/conn.php';

$course_id = $data['course_id'] ?? null;

if (empty($course_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Course ID is required."]);
    exit();
}

$sql = "DELETE FROM course WHERE course_id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log("Prepare failed in delete_course.php: " . $conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to prepare statement: " . $conn->error]);
    exit();
}

$stmt->bind_param("i", $course_id);
$execute_success = $stmt->execute();

if ($execute_success) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Course with ID $course_id deleted successfully."]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Course not found or already deleted."]);
    }
} else {
    error_log("Execute failed in delete_course.php: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database deletion failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
