<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'attendance_monitoring';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed']));
}

$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
$instructor_id = isset($_GET['instructor_id']) ? (int)$_GET['instructor_id'] : 0;

if (!$instructor_id) {
    echo json_encode(['success' => false, 'message' => 'Missing instructor_id']);
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
    JOIN student s ON sd.student_id = s.student_id
    LEFT JOIN attendance a ON sd.student_details_id = a.student_details_id AND a.date = ?
    WHERE sd.instructor_id = ?
    ORDER BY s.lastname, s.firstname
";

$stmt = $conn->prepare($query);
$stmt->bind_param("si", $date, $instructor_id);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $row['name'] = trim($row['firstname'] . ' ' . $row['middlename'] . ' ' . $row['lastname']);
    $students[] = $row;
}

echo json_encode($students);
?>
