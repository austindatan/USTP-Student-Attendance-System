<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT firstname, middlename, lastname, date_of_birth FROM instructor";
    $result = $conn->query($sql);

    $instructor = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $instructor[] = $row;
        }
    }
    echo json_encode($instructor);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>
