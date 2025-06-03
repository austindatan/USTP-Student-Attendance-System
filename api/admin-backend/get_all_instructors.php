<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../../src/conn.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT instructor_id, email, firstname, middlename, lastname, date_of_birth, contact_number, street, city, province, zipcode, country, image FROM instructor";
    $result = $conn->query($sql);
    $instructors = [];

    while ($row = $result->fetch_assoc()) {
        $instructors[] = $row;
    }

    echo json_encode(["success" => true, "instructors" => $instructors]);

} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>