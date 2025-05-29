<?php
ini_set('display_errors', 1); // Enable error display for debugging
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once("../src/conn.php");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Function to delete old image
function deleteOldImage($conn, $student_id) {
    $stmt = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
    if ($stmt === false) {
        // Log this error if you have a log, but don't stop execution
        return;
    }
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $oldImage = $row["image"];
        // Crucial: Use the same absolute path logic as for new uploads
        // Assumes 'uploads' is one level up from admin_backend
        $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;

        if ($oldImage && file_exists($uploadDir . $oldImage)) {
            if (!unlink($uploadDir . $oldImage)) {
                // Log failure to delete old image if you have a log
            }
        }
    }
    $stmt->close();
}

// Get data from the POST request (FormData is in $_POST and $_FILES)
$student_id = $_GET["student_id"] ?? null; // Corrected to $_GET for student_id from URL
$email = $_POST["email"] ?? "";
$password = $_POST["password"] ?? ""; // This will be hashed or retrieved
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

// Added these fields from React Form Data
$instructor_id = isset($_POST['instructor_id']) ? intval($_POST['instructor_id']) : null;
$program_details_id = isset($_POST['program_details_id']) ? intval($_POST['program_details_id']) : null;
$section_id = isset($_POST['section_id']) ? intval($_POST['section_id']) : null;


// Basic Validation for student_id
if (empty($student_id)) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "Missing student ID for update."]);
    $conn->close();
    exit;
}

// --- Password Logic: only update if provided and valid length for hashing ---
$hashed_password_for_update = null;
if (!empty($password)) {
    // IMPORTANT: Hash the password before storing!
    // If the provided password is short, hash it. If it's already a hash (from initial load), use it as is.
    if (strlen($password) < 60 && !password_needs_rehash($password, PASSWORD_DEFAULT)) { // Use password_needs_rehash for robustness
        $hashed_password_for_update = password_hash($password, PASSWORD_DEFAULT);
    } else {
        $hashed_password_for_update = $password; // Assume it's already a hash or a very long plain text password (unlikely)
    }
    if ($hashed_password_for_update === false) { // Check if hashing failed
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to hash password."]);
        $conn->close();
        exit;
    }
} else {
    // If password field is empty, fetch the current hashed password from DB
    $stmt_fetch_pw = $conn->prepare("SELECT password FROM student WHERE student_id = ?");
    if ($stmt_fetch_pw === false) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Internal error fetching current password (prepare error)."]);
        $conn->close();
        exit;
    }
    $stmt_fetch_pw->bind_param("i", $student_id);
    $stmt_fetch_pw->execute();
    $result_pw = $stmt_fetch_pw->get_result();
    if ($row_pw = $result_pw->fetch_assoc()) {
        $hashed_password_for_update = $row_pw["password"];
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "message" => "Student not found for password retrieval."]);
        $conn->close();
        exit;
    }
    $stmt_fetch_pw->close();
}


// --- Image Upload Logic (Copied and adapted from your working add_student.php) ---
$new_image_filename = null; // Default to null, means no change or explicit removal
$image_uploaded_this_request = false; // Flag to track if a new image was successfully uploaded

// 1. Check if a new image file was sent AND is valid
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $file_tmp_name = $_FILES["image"]["tmp_name"];
    $file_name_original = basename($_FILES["image"]["name"]); // Original filename
    $file_extension = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // Common image formats

    if (!in_array($file_extension, $allowed_extensions)) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Invalid image file type. Allowed: " . implode(', ', $allowed_extensions)]);
        $conn->close();
        exit;
    }

    // Define the ABSOLUTE path to the uploads directory based on add_student.php's working logic
    // __DIR__ is admin_backend/, so ../uploads/ goes up to ustp-student-attendance/ and into uploads/
    $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;

    // Create directory if it doesn't exist (recursive)
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) { // 0755 is typical for web server write
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Server error: Failed to create upload directory. Check server permissions."]);
            $conn->close();
            exit;
        }
    }

    $new_image_filename = uniqid("student_") . "_" . $file_name_original; // Generate unique filename
    $uploadPath = $uploadDir . $new_image_filename;

    // Attempt to move the uploaded file
    if (move_uploaded_file($file_tmp_name, $uploadPath)) {
        deleteOldImage($conn, $student_id); // Delete old image only if new one successfully uploaded
        $image_uploaded_this_request = true;
    } else {
        // More specific error for file move failure
        $php_error_message = error_get_last();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Image upload failed: Could not move file. " . ($php_error_message ? $php_error_message['message'] : 'Check directory permissions for ' . $uploadDir)]);
        $conn->close();
        exit;
    }
} else if (isset($_FILES["image"]) && $_FILES["image"]["error"] !== UPLOAD_ERR_NO_FILE) {
    // Handle other specific upload errors (e.g., file size limits)
    $upload_error_messages = [
        UPLOAD_ERR_INI_SIZE => "File too large (PHP ini size).",
        UPLOAD_ERR_FORM_SIZE => "File too large (HTML form size).",
        UPLOAD_ERR_PARTIAL => "File partially uploaded.",
        UPLOAD_ERR_NO_TMP_DIR => "Missing temporary folder.",
        UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk (permissions).",
        UPLOAD_ERR_EXTENSION => "PHP extension stopped upload."
    ];
    $error_code = $_FILES["image"]["error"];
    $error_msg = $upload_error_messages[$error_code] ?? "Unknown upload error (Code: {$error_code}).";
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Image upload error: " . $error_msg]);
    $conn->close();
    exit;
} else {
    // No new image uploaded in this request, retain the existing one from the database
    $stmt_fetch_current_image = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
    if ($stmt_fetch_current_image === false) {
        // Log this error if you have a log, but don't exit, we can proceed without updating image
    } else {
        $stmt_fetch_current_image->bind_param("i", $student_id);
        $stmt_fetch_current_image->execute();
        $result_current_image = $stmt_fetch_current_image->get_result();
        if ($row_current_image = $result_current_image->fetch_assoc()) {
            $new_image_filename = $row_current_image['image']; // Retain existing image filename
        }
        $stmt_fetch_current_image->close();
    }
}
// --- End Image Upload Logic ---


// --- Start Database Transaction for Atomicity ---
$conn->begin_transaction();

try {
    // Update student table
    $query_student = "UPDATE student SET
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

    $stmt_student = $conn->prepare($query_student);
    if ($stmt_student === false) {
        throw new Exception("Failed to prepare student update statement: " . $conn->error);
    }
    $stmt_student->bind_param("sssssssssssssi",
        $email, $hashed_password_for_update, $firstname, $middlename, $lastname,
        $date_of_birth, $contact_number, $street, $city, $province, $zipcode,
        $country, $new_image_filename, $student_id
    );
    $stmt_student->execute();
    $stmt_student->close();

    // Update student_details table
    // Check if student_details record exists for this student_id, if not, insert (unlikely for update)
    $stmt_check_sd = $conn->prepare("SELECT student_id FROM student_details WHERE student_id = ?");
    if ($stmt_check_sd === false) {
        throw new Exception("Failed to prepare student_details check statement: " . $conn->error);
    }
    $stmt_check_sd->bind_param("i", $student_id);
    $stmt_check_sd->execute();
    $result_check_sd = $stmt_check_sd->get_result();
    $stmt_check_sd->close();

    if ($result_check_sd->num_rows > 0) {
        // Record exists, update it
        $query_student_details = "UPDATE student_details SET
                                    section_id = ?,
                                    instructor_id = ?,
                                    program_details_id = ?
                                WHERE student_id = ?";
        $stmt_student_details = $conn->prepare($query_student_details);
        if ($stmt_student_details === false) {
            throw new Exception("Failed to prepare student_details update statement: " . $conn->error);
        }
        $stmt_student_details->bind_param("iiii", $section_id, $instructor_id, $program_details_id, $student_id);
    } else {
        // No record exists, insert it (this handles a rare edge case, but should ideally not happen on an edit)
        $query_student_details = "INSERT INTO student_details (student_id, section_id, instructor_id, program_details_id)
                                VALUES (?, ?, ?, ?)";
        $stmt_student_details = $conn->prepare($query_student_details);
        if ($stmt_student_details === false) {
            throw new Exception("Failed to prepare student_details insert statement: " . $conn->error);
        }
        $stmt_student_details->bind_param("iiii", $student_id, $section_id, $instructor_id, $program_details_id);
    }

    $stmt_student_details->execute();
    $stmt_student_details->close();

    $conn->commit(); // Commit transaction if all updates are successful

    // Fetch updated info to return to the frontend
    $stmt_fetch_updated = $conn->prepare("
        SELECT
            s.*,
            sd.section_id,
            sd.instructor_id,
            sd.program_details_id,
            sec.year_level_id,
            sec.semester_id
        FROM
            student s
        LEFT JOIN
            student_details sd ON s.student_id = sd.student_id
        LEFT JOIN
            section sec ON sd.section_id = sec.section_id
        WHERE
            s.student_id = ?
        LIMIT 1;
    ");
    if ($stmt_fetch_updated === false) {
        echo json_encode(["success" => false, "message" => "Profile updated, but failed to retrieve updated data (prepare error)."]);
        $conn->close();
        exit;
    }
    $stmt_fetch_updated->bind_param("i", $student_id);
    $stmt_fetch_updated->execute();
    $result_updated = $stmt_fetch_updated->get_result();

    if ($student = $result_updated->fetch_assoc()) {
        unset($student["password"]); // Remove password for security
        echo json_encode(["success" => true, "message" => "Student updated successfully!", "student" => $student]);
    } else {
        echo json_encode(["success" => false, "message" => "Student updated, but failed to retrieve updated data."]);
    }
    $stmt_fetch_updated->close();

} catch (Exception $e) {
    $conn->rollback(); // Rollback transaction on error
    // If a new image was uploaded in this request but the DB transaction failed, delete the image
    if ($image_uploaded_this_request && file_exists($uploadPath)) { // Use $uploadPath from above
        unlink($uploadPath);
    }
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Database Transaction Failed: " . $e->getMessage()]);
}

$conn->close();
?>