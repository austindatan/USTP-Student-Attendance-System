<?php
/**
 * File: add_instructor.php
 * Purpose: This script handles the creation of a new instructor.
 * It accepts a POST request containing instructor details and an optional image,
 * hashes the password, saves the data into the `instructor` table in the database,
 * and handles image upload to the server.
 */

// Set response content type to JSON
header('Content-Type: application/json');

// Allow access from any origin (CORS)
header("Access-Control-Allow-Origin: *");

// Include database connection file
include __DIR__ . '/../src/conn.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

// Collect data from the POST request
$instructor_id = $_POST['instructor_id'];
$email = $_POST['email'];

// Secure the password using hashing
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$firstname = $_POST['firstname'];
$middlename = $_POST['middlename'];
$lastname = $_POST['lastname'];
$date_of_birth = $_POST['date_of_birth'];
$contact_number = $_POST['contact_number'];
$street = $_POST['street'];
$city = $_POST['city'];
$province = $_POST['province'];
$zipcode = $_POST['zipcode'];
$country = $_POST['country'];

// Initialize image filename as null
$imageName = null;

// Check if an image is uploaded successfully
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageTmp = $_FILES['image']['tmp_name'];

    // Generate a unique filename to prevent name conflicts
    $imageName = uniqid() . '_' . basename($_FILES['image']['name']);

    // Set upload directory path
    $uploadDir = __DIR__ . '/../api/uploads/';

    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Move uploaded image to the upload directory
    move_uploaded_file($imageTmp, $uploadDir . $imageName);
}

// Prepare SQL INSERT statement with placeholders
$stmt = $conn->prepare("INSERT INTO instructor (
    instructor_id, email, password, firstname, middlename, lastname,
    date_of_birth, contact_number, street, city, province, zipcode, country, image
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Bind parameters to the prepared statement
$stmt->bind_param(
    "ssssssssssssss",
    $instructor_id, $email, $password, $firstname, $middlename, $lastname,
    $date_of_birth, $contact_number, $street, $city, $province, $zipcode, $country, $imageName
);

// Execute the query and return a response
if ($stmt->execute()) {
    echo json_encode(["message" => "Instructor added successfully"]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Failed to insert instructor"]);
}
?>