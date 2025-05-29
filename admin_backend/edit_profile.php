<?php
/**
 * File: edit_profile.php
 * Purpose: This script updates an instructor's profile in the database.
 * It accepts a POST request with updated information including an optional profile image,
 * securely handles password updates, replaces the previous image if a new one is uploaded,
 * and returns the updated instructor information as a JSON response.
 */

// Enable full error reporting for development/debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set CORS and response headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Connect to the database
$conn = new mysqli("localhost", "root", "", "attendance_monitoring");

// Check for DB connection errors
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

/**
 * Deletes the previous profile image for the instructor (if it exists).
 */
function deleteOldImage($conn, $instructor_id) {
    $stmt = $conn->prepare("SELECT image FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $oldImage = $row["image"];
        if ($oldImage && file_exists("uploads/" . $oldImage)) {
            unlink("uploads/" . $oldImage); // Delete old image from server
        }
    }
}

// Get POSTed data (with fallback defaults)
$instructor_id = $_POST["instructor_id"] ?? null;
$email = $_POST["email"] ?? "";
$password = $_POST["password"] ?? "";
$firstname = $_POST["firstname"] ?? "";
$middlename = $_POST["middlename"] ?? "";
$lastname = $_POST["lastname"] ?? "";
$date_of_birth = $_POST["date_of_birth"] ?? "";
$contact_number = $_POST["contact_number"] ?? "";
$street = $_POST["street"] ?? "";
$city = $_POST["city"] ?? "";
$province = $_POST["province"] ?? "";
$zipcode = $_POST["zipcode"] ?? "";
$country = $_POST["country"] ?? "";

// Validate required instructor_id
if (empty($_POST['instructor_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing instructor ID.']);
    exit;
}
$instructor_id = $_POST['instructor_id'];

// Handle image upload
$imageName = null;
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $imageTmp = $_FILES["image"]["tmp_name"];
    $imageName = uniqid("instructor_") . "_" . basename($_FILES["image"]["name"]);
    $uploadDir = "uploads/";
    $uploadPath = $uploadDir . $imageName;

    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Move new image and delete old one
    if (move_uploaded_file($imageTmp, $uploadPath)) {
        deleteOldImage($conn, $instructor_id);
    } else {
        echo json_encode(["success" => false, "message" => "Image upload failed."]);
        exit;
    }
}

// Handle password securely
// Hash new password only if it's not already hashed (less than 60 characters)
if (!empty($password) && strlen($password) < 60) {
    $password = password_hash($password, PASSWORD_DEFAULT);
} else {
    // If password is not provided or is already hashed, retrieve existing one from DB
    $stmt = $conn->prepare("SELECT password FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $password = $row["password"];
    }
}

// Build the update query
$query = "UPDATE instructor SET 
            email = ?, 
            password = ?, 
            firstname = ?, 
            middlename = ?, 
            lastname = ?, 
            date_of_birth = ?, 
            contact_number = ?, 
            street = ?, 
            city = ?, 
            province = ?, 
            zipcode = ?, 
            country = ?";

$params = [
    $email, $password, $firstname, $middlename, $lastname,
    $date_of_birth, $contact_number, $street, $city, $province,
    $zipcode, $country
];
$types = "ssssssssssss";

// Include image field if a new image was uploaded
if ($imageName) {
    $query .= ", image = ?";
    $params[] = $imageName;
    $types .= "s";
}

// Add WHERE clause to target specific instructor
$query .= " WHERE instructor_id = ?";
$params[] = $instructor_id;
$types .= "i";

// Prepare and execute the update query
$stmt = $conn->prepare($query);
$stmt->bind_param($types, ...$params);

// Return success or failure message
if ($stmt->execute()) {
    // Fetch updated instructor data to return
    $stmt = $conn->prepare("SELECT * FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($instructor = $result->fetch_assoc()) {
        unset($instructor["password"]); // Don't return password
        echo json_encode(["success" => true, "instructor" => $instructor]);
    } else {
        echo json_encode(["success" => false, "message" => "Updated, but fetch failed."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Update failed: " . $stmt->error]);
}

// Close database connection
$conn->close();