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
    'year_levels' => [],
    'message' => 'Failed to fetch year levels.'
];

if ($conn->connect_error) {
    http_response_code(500);
    $response['message'] = 'Database connection failed: ' . $conn->connect_error;
    echo json_encode($response);
    exit();
}

$sql = "SELECT year_id, year_level_name FROM year_level ORDER BY year_id ASC";
$result = $conn->query($sql);

if ($result) {
    $year_levels = [];
    while ($row = $result->fetch_assoc()) {
        $year_levels[] = $row;
    }
    $response['success'] = true;
    $response['year_levels'] = $year_levels;
    $response['message'] = 'Year levels fetched successfully.';
} else {
    $response['message'] = 'Query failed: ' . $conn->error;
    error_log("Error fetching year levels: " . $conn->error); // Log detailed error
}

echo json_encode($response);

$conn->close();
?>