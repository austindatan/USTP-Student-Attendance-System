<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

$instructor_id = $_GET['instructor_id'];

$sql = "SELECT
            sc.section_course_id,
            sc.section_id,
            sc.course_id,
            s.section_name,
            sc.schedule_day,
            sc.start_time,
            sc.end_time,
            sc.image,
            sc.hexcode,
            c.course_name,
            c.course_code,
            yl.year_level_name,
            sem.semester_name
        FROM SectionCourses sc
        JOIN section s ON sc.section_id = s.section_id
        JOIN course c ON sc.course_id = c.course_id
        JOIN year_level yl ON s.year_level_id = yl.year_id
        JOIN semester sem ON s.semester_id = sem.semester_id
        WHERE sc.section_course_id IN (
            SELECT DISTINCT section_course_id
            FROM student_details
            WHERE instructor_id = ?
        )";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $instructor_id);
$stmt->execute();
$result = $stmt->get_result();

$Sections = array();
while ($row = $result->fetch_assoc()) {
    $Sections[] = $row;
}

echo json_encode($Sections);

$stmt->close();
$conn->close();
?>