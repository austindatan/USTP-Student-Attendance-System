<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include __DIR__ . '/../../src/conn.php'; 

if (!$conn || $conn->connect_error) {
    http_response_code(500);

    error_log("Database connection failed in GetStudentsByProgram.php: " . ($conn ? $conn->connect_error : "conn object not initialized"));
    echo json_encode(["error" => "Database connection failed.", "details" => ($conn ? $conn->connect_error : "Connection object not available from conn.php")]);
    exit();
}

$sql = "
    SELECT p.program_name, COUNT(sd.student_id) AS count
    FROM student_details sd
    JOIN program_details pd ON sd.program_details_id = pd.program_details_id
    JOIN program p ON pd.program_id = p.program_id
    GROUP BY p.program_name
    ORDER BY count DESC
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);

    error_log("SQL query failed: " . $conn->error);
    echo json_encode(["error" => "SQL query failed.", "details" => $conn->error]);
    exit();
}

$data = [
    "labels" => [],
    "counts" => []
];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data["labels"][] = $row["program_name"];
        $data["counts"][] = (int)$row["count"]; 
    }
} else {
}

echo json_encode($data);

$conn->close();
?>