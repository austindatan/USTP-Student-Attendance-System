<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$year_level_id = isset($_GET['year_level_id']) ? intval($_GET['year_level_id']) : null;
$semester_id = isset($_GET['semester_id']) ? intval($_GET['semester_id']) : null;

$sql = "
    SELECT
        sc.section_course_id,
        s.section_name,
        c.course_code,
        c.course_name
    FROM
        section_courses sc
    JOIN
        section s ON sc.section_id = s.section_id
    JOIN
        course c ON sc.course_id = c.course_id
    WHERE 1=1
";

if ($year_level_id !== null && $year_level_id > 0) {
    $sql .= " AND s.year_level_id = " . $year_level_id;
}
if ($semester_id !== null && $semester_id > 0) {
    $sql .= " AND s.semester_id = " . $semester_id;
}

$sql .= " ORDER BY s.section_name ASC;";

$result = $conn->query($sql);

$sections = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $sections[] = $row;
    }
}

echo json_encode($sections);

$conn->close();
?>