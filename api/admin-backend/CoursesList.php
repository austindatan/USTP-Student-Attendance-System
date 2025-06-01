<?php
// CoursesList.php

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

// SQL query to fetch all Courses
$sql = "SELECT course_id, course_name FROM course ORDER BY course_name";

$result = $conn->query($sql);

$Courses = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $Courses[] = $row;
    }
    echo json_encode(["success" => true, "Courses" => $Courses]);
} else {
    echo json_encode(["success" => true, "Courses" => [], "message" => "No Courses found"]);
}

$conn->close();
?>
