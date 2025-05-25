<?php
// student_api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "
        SELECT DISTINCT student.student_id, student.firstname, student.middlename, student.lastname, student.date_of_birth, student.contact_number, student.street, student.city, student.province, student.zipcode FROM drop_request 
        INNER JOIN attendance ON attendance.attendance_id = drop_request.attendance_id
        INNER JOIN student ON student.student_id = attendance.student_id
        WHERE (drop_request.status != 'Dropped')
    ";

    $result = $conn->query($query);

    $students = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
    }

    echo json_encode($students);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method."]);
}
