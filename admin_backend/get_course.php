<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(); 
}

include __DIR__ . '/../src/conn.php'; 

$sql = "SELECT course_id, course_code FROM course";
$result = $conn->query($sql);
$course = [];

while ($row = $result->fetch_assoc()) {
    $course[] = $row;
}

echo json_encode(["success" => true, "courses" => $course]);

$conn->close();
?>