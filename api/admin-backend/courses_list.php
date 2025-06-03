<?php
// courses_list.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// SQL query to fetch all courses
$sql = "SELECT course_id, course_name FROM course ORDER BY course_name";

$result = $conn->query($sql);

$courses = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
    echo json_encode(["success" => true, "courses" => $courses]);
} else {
    echo json_encode(["success" => true, "courses" => [], "message" => "No courses found"]);
}

$conn->close();
?>
