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

// Select students with their attendance status for the given date
$query = "SELECT s.student_id, s.firstname, s.middlename, s.lastname, s.image, a.status 
          FROM student s
          LEFT JOIN attendance a ON s.student_id = a.student_id AND a.date = ?
          ORDER BY s.lastname, s.firstname";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    // Combine the full name here
    $row['name'] = trim($row['firstname'] . ' ' . $row['middlename'] . ' ' . $row['lastname']);
    $students[] = $row;
}

echo json_encode($students);
?>
