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

$sql = "SELECT program_details.program_details_id, program.program_name FROM program_details
INNER JOIN program ON program.program_id = program_details.program_id";
$result = $conn->query($sql);

$pd = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $pd[] = $row;
    }
}

echo json_encode($pd);

$conn->close();
?>
