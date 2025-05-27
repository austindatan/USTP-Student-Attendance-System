<?php
/**
 * File: instructor_api.php
 * Purpose: This API handles CRUD operations (GET, POST, PUT) for instructor records.
 * It supports CORS and JSON communication. Designed for general backend interaction.
 */

// Set headers to return JSON and allow CORS
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include database connection
include __DIR__ . '/../src/conn.php';

// Get the HTTP request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle GET request: Retrieve all instructors
if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM instructor");
    $data = [];

    // Fetch all records into an array
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Return the instructor list in JSON format
    echo json_encode($data);
    exit;
}

// Handle POST request: Add a new instructor
if ($method === 'POST') {
    // Read the raw JSON input and decode it into an array
    $data = json_decode(file_get_contents('php://input'), true);

    // Prepare SQL statement to insert new instructor
    $stmt = $conn->prepare("INSERT INTO instructor (firstname, middlename, lastname, date_of_birth) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['firstname'], $data['middlename'], $data['lastname'], $data['date_of_birth']);

    // Execute and return confirmation
    $stmt->execute();
    echo json_encode(["message" => "Instructor added successfully"]);
    exit;
}

// Handle PUT request: Update an existing instructor
if ($method === 'PUT') {
    // Read and decode the JSON input
    $data = json_decode(file_get_contents('php://input'), true);

    // Prepare SQL statement to update the instructor
    $stmt = $conn->prepare("UPDATE instructor SET firstname=?, middlename=?, lastname=?, date_of_birth=? WHERE id=?");
    $stmt->bind_param("ssssi", $data['firstname'], $data['middlename'], $data['lastname'], $data['date_of_birth'], $data['id']);

    // Execute and return confirmation
    $stmt->execute();
    echo json_encode(["message" => "Instructor updated successfully"]);
    exit;
}

// Handle OPTIONS preflight request
if ($method === 'OPTIONS') {
    http_response_code(200); // OK
    exit();
}

// If request method is not supported, return 405 Method Not Allowed
http_response_code(405);
echo json_encode(["message" => "Method not allowed"]);