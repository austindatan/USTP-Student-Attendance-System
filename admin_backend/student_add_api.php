<?php
header('Content-Type: application/json');

// Allow requests from your React app on localhost:3000
header("Access-Control-Allow-Origin: http://localhost:3000");

// Allow POST method and OPTIONS for preflight
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Allow headers needed for JSON payload
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS preflight request and exit early with 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $firstname = $conn->real_escape_string($data['firstname']);
    $middlename = $conn->real_escape_string($data['middlename']);
    $lastname = $conn->real_escape_string($data['lastname']);
    $date_of_birth = $conn->real_escape_string($data['date_of_birth']);
    $contact_number = $conn->real_escape_string($data['contact_number']);

    $sql = "INSERT INTO student (firstname, middlename, lastname, date_of_birth, contact_number)
            VALUES ('$firstname', '$middlename', '$lastname', '$date_of_birth', '$contact_number')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Student added successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to add student"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>