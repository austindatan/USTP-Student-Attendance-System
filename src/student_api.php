<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");  // for dev only, adjust for production
header("Access-Control-Allow-Methods: GET");

include 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT firstname, middlename, lastname, date_of_birth, contact_number FROM student";
    $result = $conn->query($sql);

    $students = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
    }
    echo json_encode($students);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>
