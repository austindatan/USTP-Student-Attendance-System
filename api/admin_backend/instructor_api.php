<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM instructor");
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $conn->prepare("INSERT INTO instructor (firstname, middlename, lastname, date_of_birth) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['firstname'], $data['middlename'], $data['lastname'], $data['date_of_birth']);


    $stmt->execute();
    echo json_encode(["message" => "Instructor added successfully"]);
    exit;
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $conn->prepare("UPDATE instructor SET firstname=?, middlename=?, lastname=?, date_of_birth=? WHERE id=?");
    $stmt->bind_param("ssssi", $data['firstname'], $data['middlename'], $data['lastname'], $data['date_of_birth'], $data['id']);

    $stmt->execute();
    echo json_encode(["message" => "Instructor updated successfully"]);
    exit;
}

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

http_response_code(405);
echo json_encode(["message" => "Method not allowed"]);