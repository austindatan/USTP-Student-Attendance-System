<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$sql = "SELECT semester_id, semester_name FROM semester ORDER BY semester_id ASC";
$result = $conn->query($sql);

$semesters = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $semesters[] = $row;
    }
}

echo json_encode($semesters);

$conn->close();
?>