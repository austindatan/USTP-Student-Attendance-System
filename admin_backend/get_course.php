<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include __DIR__ . '/../src/conn.php';

$sql = "SELECT course_id, course_code, course_name FROM course"; 
$result = $conn->query($sql);

$course = [];

if ($result) { 
    while ($row = $result->fetch_assoc()) {
        $course[] = $row;
    }
    echo json_encode(["success" => true, "courses" => $course]);
} else {

    error_log("SQL Error in get_course.php: " . $conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database query failed: " . $conn->error]);
}


$conn->close();
?>