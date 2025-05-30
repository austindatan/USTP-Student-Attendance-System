<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Use robust include path
include_once __DIR__ . '/../../src/conn.php';

$student_id = $_GET['student_id'] ?? null;

if (!$student_id) {
    echo json_encode(["error" => "Missing student_id"]);
    exit;
}

if (!isset($conn)) {
    echo json_encode(["error" => "Database connection not established."]);
    exit;
}

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
        WHERE sd.student_id = ?";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

$sections = [];
while ($row = $result->fetch_assoc()) {
    $sections[] = $row;
}

echo json_encode($sections, JSON_PRETTY_PRINT);

$stmt->close();
$conn->close();
?>
