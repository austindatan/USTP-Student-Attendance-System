<?php
/**
 * File: get_all_instructors.php
 * Purpose: This script retrieves and returns all instructor records from the database.
 * It responds to GET requests and returns the list of instructors as a JSON array.
 */

// Set response headers for JSON and CORS
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // OK for preflight
    exit();
}

// Include database connection file
include __DIR__ . '/../src/conn.php';

// Process GET request to fetch all instructors
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // SQL query to select all instructor fields (excluding password for security)
    $sql = "SELECT instructor_id, email, firstname, middlename, lastname, date_of_birth, contact_number, street, city, province, zipcode, country, image FROM instructor";
    $result = $conn->query($sql);

    // Initialize array to hold instructor records
    $instructors = [];
    
    // Loop through result set and build the response array
    while ($row = $result->fetch_assoc()) {
        $instructors[] = $row;
    }

    // Return the instructor list as a JSON response
    echo json_encode($instructors);
} else {
    // Respond with 405 if method is not GET
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>