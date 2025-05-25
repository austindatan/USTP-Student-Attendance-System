<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");  // for dev only, adjust for production
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $stmt = "
        SELECT student.student_id, 
               CONCAT(student.firstname, ' ', student.middlename, ' ', student.lastname) AS student_name, 
               program.program_name, 
               course.course_name, 
               CONCAT(instructor.firstname, ' ', instructor.middlename, ' ', instructor.lastname) AS instructor_name, 
               drop_request.drop_request_id,
               drop_request.reason, 
               drop_request.status 
        FROM drop_request
        INNER JOIN attendance ON attendance.attendance_id = drop_request.attendance_id
        INNER JOIN student_details ON student_details.student_details_id = attendance.student_details_id
        INNER JOIN student ON student.student_id = student_details.student_id
        INNER JOIN instructor ON instructor.instructor_id = student_details.instructor_id
        INNER JOIN section ON section.section_id = student_details.section_id
        INNER JOIN course ON course.course_id = section.course_id
        INNER JOIN program_details ON program_details.program_details_id = student_details.program_details_id
        INNER JOIN program ON program.program_id = program_details.program_id
    ";
    $result = $conn->query($stmt);

    $student = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $student[] = $row;
        }
    }
    echo json_encode($student);
} else {
    echo json_encode(["error" => "Invalid request method for GET endpoint"]);
}
