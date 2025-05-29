<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php';

$instructor_id = $_GET['instructor_id'];

// Modified SQL query to join through 'section_courses' as per the latest schema,
// and include year level name and semester name from the 'section' table.
$sql = "SELECT DISTINCT sc.section_id, sc.course_id, 
                s.section_name, sc.schedule_day, sc.start_time, sc.end_time, sc.image, sc.hexcode, 
                c.course_name, c.course_code, 
                yl.year_level_name, sem.semester_name
        FROM student_details sd
        JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
        JOIN section s ON sc.section_id = s.section_id
        JOIN course c ON sc.course_id = c.course_id
        JOIN year_level yl ON yl.year_id = s.year_level_id
        JOIN semester sem ON sem.semester_id = s.semester_id
        WHERE sd.instructor_id = ?";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $instructor_id);
$stmt->execute();
$result = $stmt->get_result();

$sections = array();
while ($row = $result->fetch_assoc()) {
    $sections[] = $row;
}

echo json_encode($sections);

$stmt->close();
$conn->close();
?>