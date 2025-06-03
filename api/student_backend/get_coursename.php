<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

include_once __DIR__ . '/../../src/conn.php'; 

$response = [];

if (isset($_GET['student_id']) && isset($_GET['course_code'])) {
    $studentId = intval($_GET['student_id']);
    $courseCode = $_GET['course_code']; 

    $stmt = $conn->prepare("
        SELECT
            course.course_name,
            section_courses.image,  -- Added image column
            section_courses.hexcode -- Added hexcode column
        FROM student_details
        INNER JOIN section_courses ON section_courses.section_course_id = student_details.section_course_id
        INNER JOIN course ON course.course_id = section_courses.course_id
        INNER JOIN student ON student.student_id = student_details.student_id
        WHERE student_details.student_id = ? AND course.course_code = ?
    ");

    if ($stmt === false) {
        $response['error'] = "Prepare failed: " . $conn->error;
        echo json_encode($response);
        $conn->close();
        exit();
    }

    $stmt->bind_param("is", $studentId, $courseCode);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response['course_name'] = $row['course_name'];
        $response['image'] = $row['image'];  
        $response['hexcode'] = $row['hexcode'];
    } else {
        $response['error'] = "Course not found for the given student and course code.";
    }
    $stmt->close();
} else {
    $response['error'] = "student_id and course_code are required.";
}

$conn->close();
echo json_encode($response);
?>