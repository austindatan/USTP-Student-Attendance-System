<?php
// student_api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "
        SELECT 
            s.student_id, 
            s.firstname, 
            s.middlename, 
            s.lastname, 
            s.date_of_birth, 
            s.contact_number, 
            s.street, 
            s.city, 
            s.province, 
            s.zipcode 
        FROM student s
        WHERE NOT EXISTS (
            SELECT 1
            FROM student_details sd
            INNER JOIN drop_request d ON d.student_details_id = sd.student_details_id
            WHERE sd.student_id = s.student_id
            AND d.status = 'Dropped'
        )
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
