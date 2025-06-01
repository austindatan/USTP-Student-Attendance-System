<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include __DIR__ . '/../src/conn.php'; // Adjust path as necessary

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT section_id, section_name FROM section ORDER BY section_name";
    $result = $conn->query($query);

    $sections = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $sections[] = $row;
        }
    }

    echo json_encode(["success" => true, "sections" => $sections]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
}

if ($conn) {
    $conn->close();
}
?>