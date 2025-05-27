<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php';

$instructor_id = $_GET['instructor_id'];

$sql = "SELECT DISTINCT s.section_id, s.course_id, s.section_name, s.schedule_day, s.start_time, s.end_time, s.image, s.hexcode, c.course_name, c.course_code
        FROM section s
        JOIN student_details sd ON sd.section_id = s.section_id
        JOIN course c ON c.course_id = s.course_id
        WHERE sd.instructor_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $instructor_id);
$stmt->execute();
$result = $stmt->get_result();

$sections = array();
while ($row = $result->fetch_assoc()) {
    $sections[] = $row;
}

echo json_encode($sections);
?>
