<?php
// Set CORS headers before any output
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . '/../src/conn.php';

// Check database connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Fetch student data
$sql = "SELECT student.student_id, CONCAT(student.firstname, ' ', student.middlename, ' ', student.lastname) AS student_name 
        FROM student_details
        INNER JOIN student ON student.student_id = student_details.student_id";
$result = $conn->query($sql);

$students = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

// Return result as JSON
echo json_encode($students);

// Close DB connection
$conn->close();
?>
