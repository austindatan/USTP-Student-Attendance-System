<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include __DIR__ . '/../../src/conn.php'; 

$response = [
    'success' => false,
    'semesters' => [],
    'message' => 'Failed to fetch semesters.'
];

if ($conn->connect_error) {
    http_response_code(500);
    $response['message'] = 'Database connection failed: ' . $conn->connect_error;
    echo json_encode($response);
    exit();
}

$sql = "SELECT semester_id, semester_name FROM semester ORDER BY semester_id ASC";
$result = $conn->query($sql);

if ($result) {
    $semesters = [];
    while ($row = $result->fetch_assoc()) {
        $semesters[] = $row;
    }
    $response['success'] = true;
    $response['semesters'] = $semesters;
    $response['message'] = 'Semesters fetched successfully.';
} else {
    $response['message'] = 'Query failed: ' . $conn->error;
    error_log("Error fetching semesters: " . $conn->error); // Log detailed error
}

echo json_encode($response);

$conn->close();
?>