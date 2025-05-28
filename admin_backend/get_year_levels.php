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

$sql = "SELECT year_id, year_level_name FROM year_level ORDER BY year_id ASC";
$result = $conn->query($sql);

$year_levels = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $year_levels[] = $row;
    }
}

echo json_encode($year_levels);

$conn->close();
?>