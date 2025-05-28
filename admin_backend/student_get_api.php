<?php
// student_get_api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['student_id'])) {
    $student_id = intval($_GET['student_id']);
    
    // Adjust query to fetch all needed fields
    $stmt = $conn->prepare("
        SELECT 
            s.student_id, s.firstname, s.middlename, s.lastname, s.date_of_birth, s.contact_number, s.email, s.street, s.city, s.province, s.zipcode, s.country, s.image, 
            sd.section_id, sd.instructor_id, sd.program_details_id
        FROM student s
        INNER JOIN student_details sd ON s.student_id = sd.student_id
        WHERE s.student_id = ?
    ");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Student not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Bad Request"]);
}
?>
