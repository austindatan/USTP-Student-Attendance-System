<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $stmt = "
        SELECT 
            excused_request.excused_request_id, 
            student_details.student_details_id, 
            CONCAT(student.firstname, ' ', student.middlename, ' ', student.lastname) AS student_name, 
            course.course_name, 
            excused_request.reason, 
            excused_request.date_requested, 
            excused_request.date_of_absence,
            excused_request.status 
        FROM excused_request
        INNER JOIN student_details 
            ON excused_request.student_details_id = student_details.student_details_id
        INNER JOIN student 
            ON student.student_id = student_details.student_id
        INNER JOIN section 
            ON section.section_id = student_details.section_id
        INNER JOIN course 
            ON course.course_id = section.course_id;
    ";
    $result = $conn->query($stmt);

    $req = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $req[] = $row;
        }
    }
    echo json_encode($req);
} else {
    echo json_encode(["error" => "Invalid request method for GET endpoint"]);
}
