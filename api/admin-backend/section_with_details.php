<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT
            s.section_id,
            s.section_name,
            yl.year_level_name,
            sem.semester_name
        FROM
            section s
        LEFT JOIN
            year_level yl ON s.year_level_id = yl.year_id
        LEFT JOIN
            semester sem ON s.semester_id = sem.semester_id
        ORDER BY
            s.section_name";

$result = $conn->query($sql);

$sections = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $sections[] = $row;
    }
    echo json_encode(["success" => true, "sections" => $sections]);
} else {
    echo json_encode(["success" => true, "sections" => [], "message" => "No sections found"]);
}

$conn->close();
?>
