<?php
// student_api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

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
            s.zipcode,
            -- Use GROUP_CONCAT to display all associated programs, sections, and courses
            GROUP_CONCAT(DISTINCT p.program_name ORDER BY p.program_name SEPARATOR ', ') AS program_name,
            GROUP_CONCAT(DISTINCT CONCAT(sec.section_name, ' (', c.course_code, ' - ', c.course_name, ')') ORDER BY sec.section_name, c.course_code SEPARATOR '; ') AS enrolled_classes
        FROM
            student s
        INNER JOIN
            student_details sd ON s.student_id = sd.student_id
        INNER JOIN
            section_courses sc ON sd.section_course_id = sc.section_course_id -- New join to section_courses
        INNER JOIN
            section sec ON sec.section_id = sc.section_id -- Join to section via section_courses
        INNER JOIN
            course c ON c.course_id = sc.course_id -- Join to course via section_courses
        INNER JOIN
            program_details pd ON pd.program_details_id = sd.program_details_id
        INNER JOIN
            program p ON p.program_id = pd.program_id
        WHERE NOT EXISTS (
            SELECT 1
            FROM student_details sd2
            INNER JOIN drop_request d ON d.student_details_id = sd2.student_details_id
            WHERE sd2.student_id = s.student_id
            AND d.status = 'Dropped'
        )
        GROUP BY
            s.student_id 
        ORDER BY
            s.lastname, s.firstname
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

$conn->close();
?>