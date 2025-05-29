<?php
// student_get_api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "attendance_monitoring");

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['student_id'])) {
    $student_id = intval($_GET['student_id']);

    $sql = "
        SELECT
            s.student_id,
            s.firstname,
            s.middlename,
            s.lastname,
            s.date_of_birth,
            s.contact_number,
            s.email,
            s.street,
            s.city,
            s.province,
            s.zipcode,
            s.country,
            s.image,
            sd.section_id,
            sd.instructor_id,
            sd.program_details_id,
            sec.year_level_id,  -- <--- THIS IS THE KEY ADDITION
            sec.semester_id     -- <--- THIS IS THE KEY ADDITION
        FROM
            student s
        JOIN
            student_details sd ON s.student_id = sd.student_id
        LEFT JOIN
            section sec ON sd.section_id = sec.section_id -- Join with section to get year and semester IDs
        WHERE
            s.student_id = ?
        LIMIT 1;
    ";

    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Database prepare failed: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc();
        // Nullify password for security reasons (don't send it to frontend)
        unset($student['password']);
        echo json_encode($student);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Student not found."]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["message" => "Invalid request. student_id is required."]);
}

$conn->close();
?>