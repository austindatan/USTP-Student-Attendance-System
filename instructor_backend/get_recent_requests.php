<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php';

$instructor_id = $_GET['instructor_id'] ?? null;

if (!$instructor_id) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT er.excused_request_id, er.reason, er.date_requested, sd.student_details_id  
        FROM excused_request er
        JOIN student_details sd ON sd.student_details_id = er.student_details_id
        WHERE sd.instructor_id = ?
        ORDER BY er.date_requested DESC
        LIMIT 5";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $instructor_id);
$stmt->execute();
$result = $stmt->get_result();

$requests = [];
while ($row = $result->fetch_assoc()) {
    $requests[] = [
        'id' => $row['excused_request_id'],
        'subject' => $row['reason'],
        'sender' => $row['name'],
        'time' => date('M d, Y', strtotime($row['date_requested'])), // e.g., May 26, 2025
    ];
}

echo json_encode($requests);
$conn->close();