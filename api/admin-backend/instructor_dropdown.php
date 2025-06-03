<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);


header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$sql = "SELECT instructor_id, firstname, lastname FROM instructor";
$result = $conn->query($sql);

$instructors = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $instructors[] = $row;
    }
}

echo json_encode($instructors);

$conn->close();
?>
