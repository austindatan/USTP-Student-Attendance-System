<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
$instructor_id = isset($_GET['instructor_id']) ? (int)$_GET['instructor_id'] : 0;
$section_id = isset($_GET['section_id']) ? (int)$_GET['section_id'] : 0;
$course_id = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;

if (!$instructor_id || !$section_id || !$course_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

$query = "
    SELECT DISTINCT
        sd.student_details_id,
        s.student_id,
        s.firstname,
        s.middlename,
        s.lastname,
        s.image,
        a.status
    FROM student_details sd
    INNER JOIN student s ON sd.student_id = s.student_id
    LEFT JOIN attendance a ON sd.student_details_id = a.student_details_id AND a.date = ?
    LEFT JOIN drop_request dr ON sd.student_details_id = dr.student_details_id
    INNER JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
    WHERE
        sc.instructor_id = ?
        AND sc.section_id = ?
        AND sc.course_id = ?
        AND (dr.status IS NULL OR dr.status != 'Dropped')
    ORDER BY s.lastname, s.firstname
";

$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("siii", $date, $instructor_id, $section_id, $course_id);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    // REMOVED: $row['name'] = trim($row['firstname'] . ' ' . $row['middlename'] . ' ' . $row['lastname']);
    $students[] = $row;
}

echo json_encode($students);

$stmt->close();
$conn->close();
?>