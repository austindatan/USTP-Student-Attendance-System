<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php';

$instructor_id = $_GET['instructor_id'];

$days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
$response = [];

foreach ($days as $day) {
    $query = "
        SELECT COUNT(*) as students
        FROM attendance a
        JOIN student_details sd ON sd.student_details_id = a.student_details_id
        WHERE a.status = 'Present'
        AND sd.instructor_id = ?
        AND DAYNAME(a.date) = ?
    ";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("is", $instructor_id, $day);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $response[] = ['name' => substr($day, 0, 3), 'students' => (int)$result['students']];
}

echo json_encode($response);
$conn->close();
