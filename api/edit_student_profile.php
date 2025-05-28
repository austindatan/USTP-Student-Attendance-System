<?php
ini_set('display_errors', 1); // Enable error display for debugging
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
// Allow POST and OPTIONS for pre-flight requests
header("Access-Control-Allow-Methods: POST, OPTIONS");
// Include Content-Type and Authorization (if you use tokens)
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle pre-flight OPTIONS request
// This is crucial for CORS when using POST with custom headers or FormData
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond with 200 OK
    exit(0); // Exit immediately after handling OPTIONS
}

// Assuming conn.php contains your database connection logic
// CORRECTED PATH: Go up one directory (from 'api/') then into 'src/'
require_once("../src/conn.php");

// Check if the connection is successful
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Function to delete old image (remains the same)
function deleteOldImage($conn, $student_id) {
    $stmt = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
    if ($stmt === false) {
        error_log("Failed to prepare statement for old image fetch: " . $conn->error);
        return; // Don't exit, just log and continue
    }
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $oldImage = $row["image"];
        // Check if oldImage is not null or empty and exists before unlinking
        if ($oldImage && file_exists("uploads/" . $oldImage)) {
            if (!unlink("uploads/" . $oldImage)) {
                error_log("Failed to delete old image: uploads/" . $oldImage);
            }
        }
    }
    $stmt->close();
}

// Get data from the POST request (FormData is in $_POST and $_FILES)
$student_id = $_POST["student_id"] ?? null;
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

// Basic Validation
if (empty($student_id)) {
    echo json_encode(["success" => false, "message" => "Missing student ID for update."]);
    $conn->close();
    exit;
}
// Add more validation for other fields as necessary (e.g., email format, required fields)

// --- Determine image filename for update ---
$new_image_filename = null; // Default to null, meaning no change or explicit removal if frontend sends empty image
$image_uploaded = false;

// Check if a new image file was sent
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $file_tmp_name = $_FILES["image"]["tmp_name"];
    $file_name = basename($_FILES["image"]["name"]);
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (!in_array($file_extension, $allowed_extensions)) {
        echo json_encode(["success" => false, "message" => "Invalid image file type."]);
        $conn->close();
        exit;
    }

    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true); // Create directory if it doesn't exist
    }

    $new_image_filename = uniqid("student_") . "_" . $file_name; // Generate unique name
    $uploadPath = $uploadDir . $new_image_filename;

    if (move_uploaded_file($file_tmp_name, $uploadPath)) {
        deleteOldImage($conn, $student_id); // Delete old image only if new one successfully uploaded
        $image_uploaded = true;
    } else {
        echo json_encode(["success" => false, "message" => "Image upload failed."]);
        $conn->close();
        exit;
    }
} else if (isset($_FILES["image"]) && $_FILES["image"]["error"] !== UPLOAD_ERR_NO_FILE) {
    // Handle other upload errors (e.g., file too large, partial upload)
    echo json_encode(["success" => false, "message" => "Image upload error: " . $_FILES["image"]["error"]]);
    $conn->close();
    exit;
} else {
    // No new image uploaded, fetch current image path from DB to retain it
    $stmt_fetch_current_image = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
    if ($stmt_fetch_current_image === false) {
        error_log("Failed to prepare statement for fetching current image: " . $conn->error);
        // Continue without updating image if fetch fails
    } else {
        $stmt_fetch_current_image->bind_param("i", $student_id);
        $stmt_fetch_current_image->execute();
        $result_current_image = $stmt_fetch_current_image->get_result();
        if ($row_current_image = $result_current_image->fetch_assoc()) {
            $new_image_filename = $row_current_image['image']; // Retain existing image
        }
        $stmt_fetch_current_image->close();
    }
}


// --- Password Logic: only update if provided and valid length for hashing ---
$hashed_password_for_update = null;
if (!empty($password)) {
    // IMPORTANT: Hash the password before storing!
    // password_hash typically returns a string of 60 characters or more.
    // If the input password is already a hash (from fetching the profile),
    // and the user didn't type a new one, we don't want to re-hash it.
    // The previous logic was good for this:
    if (strlen($password) < 60) { // Assuming a new, unhashed password will be shorter than a hash
        $hashed_password_for_update = password_hash($password, PASSWORD_DEFAULT);
    } else {
        // If it's 60+ chars, assume it's already a hash (from initial load)
        // and the user didn't change it. So, use the existing hash.
        $hashed_password_for_update = $password;
    }
} else {
    // If password field is empty, fetch the current hashed password from DB
    $stmt_fetch_pw = $conn->prepare("SELECT password FROM student WHERE student_id = ?");
    if ($stmt_fetch_pw === false) {
        error_log("Failed to prepare statement for fetching password: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Internal error fetching password."]);
        $conn->close();
        exit;
    }
    $stmt_fetch_pw->bind_param("i", $student_id);
    $stmt_fetch_pw->execute();
    $result_pw = $stmt_fetch_pw->get_result();
    if ($row_pw = $result_pw->fetch_assoc()) {
        $hashed_password_for_update = $row_pw["password"];
    } else {
        // This case should ideally not happen if student_id is valid
        echo json_encode(["success" => false, "message" => "Student not found for password retrieval."]);
        $conn->close();
        exit;
    }
    $stmt_fetch_pw->close();
}


// --- Prepare and Execute Update Query ---
$query = "UPDATE student SET
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
            country = ?,
            image = ?
          WHERE student_id = ?";

$params = [
    $email,
    $hashed_password_for_update, // Use the determined password hash
    $firstname,
    $middlename,
    $lastname,
    $date_of_birth,
    $contact_number,
    $street,
    $city,
    $province,
    $zipcode,
    $country,
    $new_image_filename, // Use the determined image filename
    $student_id
];
$types = "sssssssssssssi"; // 12 's' for strings, 1 'i' for student_id

$stmt = $conn->prepare($query);

if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Failed to prepare statement: " . $conn->error]);
    $conn->close();
    exit;
}

// Dynamically bind parameters
// The `...$params` syntax requires PHP 5.6+
$stmt->bind_param($types, ...$params);


if ($stmt->execute()) {
    // Fetch updated info to return to the frontend
    $stmt_fetch_updated = $conn->prepare("SELECT * FROM student WHERE student_id = ?");
    if ($stmt_fetch_updated === false) {
        error_log("Failed to prepare statement for fetching updated student: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Profile updated, but failed to retrieve updated data (prepare error)."]);
        $conn->close();
        exit;
    }
    $stmt_fetch_updated->bind_param("i", $student_id);
    $stmt_fetch_updated->execute();
    $result_updated = $stmt_fetch_updated->get_result();

    if ($student = $result_updated->fetch_assoc()) {
        unset($student["password"]); // Remove password for security
        echo json_encode(["success" => true, "message" => "Profile updated successfully.", "student" => $student]);
    } else {
        echo json_encode(["success" => false, "message" => "Profile updated, but failed to retrieve updated data."]);
    }
    $stmt_fetch_updated->close();
} else {
    echo json_encode(["success" => false, "message" => "Update failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
