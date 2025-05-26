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
    p.program_name,
    sec.section_name,
    s.date_of_birth, 
    s.contact_number, 
    s.street, 
    s.city, 
    s.province, 
    s.zipcode 
        FROM student_details sd
        INNER JOIN student s ON sd.student_id = s.student_id
        INNER JOIN section sec ON sec.section_id = sd.section_id
        INNER JOIN program_details pd ON pd.program_details_id = sd.program_details_id
        INNER JOIN program p ON p.program_id = pd.program_id
        WHERE NOT EXISTS (
            SELECT 1
            FROM student_details sd2
            INNER JOIN drop_request d ON d.student_details_id = sd2.student_details_id
            WHERE sd2.student_id = s.student_id
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
