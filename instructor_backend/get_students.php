<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once('../src/conn.php');

$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
$instructor_id = isset($_GET['instructor_id']) ? (int)$_GET['instructor_id'] : 0;
$section_id = isset($_GET['section_id']) ? (int)$_GET['section_id'] : 0; // NEW: Get section_id

if (!$instructor_id || !$section_id) { // MODIFIED: Check for section_id
    echo json_encode(['success' => false, 'message' => 'Missing instructor_id or section_id']);
    exit;
}

$query = "
    SELECT
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
WHERE sd.instructor_id = ?
AND sd.section_id = ?  -- Filter by section_id
AND (dr.status IS NULL OR dr.status != 'Dropped')  -- Ensure dropped students are excluded
ORDER BY s.lastname, s.firstname
";


$stmt = $conn->prepare($query);
$stmt->bind_param("sii", $date, $instructor_id, $section_id); // MODIFIED: Added 'i' for section_id
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $row['name'] = trim($row['firstname'] . ' ' . $row['middlename'] . ' ' . $row['lastname']);
    $students[] = $row;
}

echo json_encode($students);

$stmt->close(); // Close statement
$conn->close(); // Close connection
?>