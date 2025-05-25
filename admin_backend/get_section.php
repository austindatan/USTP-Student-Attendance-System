<?php
// student_api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "
       SELECT section.section_name, course.course_name, section.schedule_day, section.start_time, section.end_time FROM section
INNER JOIN course ON course.course_id = section.course_id
    ";

    $result = $conn->query($query);

    $sections = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $sections[] = $row;
        }
    }

    echo json_encode($sections);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method."]);
}
