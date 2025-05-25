<?php
// student_api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "
       SELECT course_name, description FROM course
    ";

    $result = $conn->query($query);

    $courses = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
    }

    echo json_encode($courses);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method."]);
}
