<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Get the student_id from the query string
    if (!isset($_GET['student_id'])) {
        http_response_code(400);
        echo json_encode(["message" => "Missing student_id"]);
        exit();
    }
    $student_id = intval($_GET['student_id']);

    // Get the PUT data (raw JSON)
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid JSON input"]);
        exit();
    }

    // Prepare the SQL update statement
    $stmt = $conn->prepare("UPDATE student SET firstname = ?, middlename = ?, lastname = ?, date_of_birth = ?, contact_number = ? WHERE student_id = ?");
    $stmt->bind_param(
        "sssssi",
        $input['firstname'],
        $input['middlename'],
        $input['lastname'],
        $input['date_of_birth'],
        $input['contact_number'],
        $student_id
    );

    if ($stmt->execute()) {
        echo json_encode(["message" => "Student updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to update student"]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}

$conn->close();
?>