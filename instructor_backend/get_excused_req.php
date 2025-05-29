<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Enable error reporting for debugging
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    if ($conn->connect_error) {
        echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }

    $sql = "
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
        INNER JOIN section_courses sc -- Join with section_courses to get course_id
            ON student_details.section_course_id = sc.section_course_id
        INNER JOIN course 
            ON course.course_id = sc.course_id; -- Use course_id from section_courses
    ";
    
    // Using query() for simple SELECT without parameters
    $result = $conn->query($sql);

    if ($result === false) {
        echo json_encode(['error' => 'SQL query failed: ' . $conn->error]);
        exit;
    }

    $req = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $req[] = $row;
        }
    }
    echo json_encode($req);

    $conn->close();

} else {
    echo json_encode(["error" => "Invalid request method for GET endpoint"]);
}
?>