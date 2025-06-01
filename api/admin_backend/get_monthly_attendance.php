<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include __DIR__ . '/../src/conn.php'; 

$monthlyCounts = array_fill(1, 12, 0);

$query = "
    SELECT MONTH(date) AS month, COUNT(*) AS count
    FROM attendance
    WHERE status = 'Present'
    GROUP BY MONTH(date)
    ORDER BY MONTH(date)
";

$result = $conn->query($query);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $monthlyCounts[(int)$row['month']] = (int)$row['count'];
    }

    echo json_encode([
        "labels" => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "counts" => array_values($monthlyCounts)
    ]);
} else {
    echo json_encode([
        "error" => "Failed to fetch monthly attendance",
        "details" => $conn->error
    ]);
}

$conn->close();
?>
