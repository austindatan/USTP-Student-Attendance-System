<?php
ini_set('display_errors', 1);
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
        $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;

        if ($oldImage && file_exists($uploadDir . $oldImage)) {
            if (!unlink($uploadDir . $oldImage)) {
                // Log failure to delete old image if you have a log
            }
        }
    }
    $stmt->close();
}

// Get student_id from URL parameter
$student_id = $_GET["student_id"] ?? null;

// Basic Validation for student_id
if (empty($student_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing student ID for update."]);
    $conn->close();
    exit;
}

// Get main student data from POST
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

// Decode the enrollments JSON array
$enrollments_json = $_POST['enrollments'] ?? '[]';
$enrollments_data = json_decode($enrollments_json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON for enrollments: " . json_last_error_msg()]);
    $conn->close();
    exit;
}

if (!is_array($enrollments_data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Enrollments data is not an array."]);
    $conn->close();
    exit;
}

// --- Password Logic ---
$hashed_password_for_update = null;
if (!empty($password)) {
    if (strlen($password) < 60 && !password_needs_rehash($password, PASSWORD_DEFAULT)) {
        $hashed_password_for_update = password_hash($password, PASSWORD_DEFAULT);
    } else {
        $hashed_password_for_update = $password;
    }
    if ($hashed_password_for_update === false) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to hash password."]);
        $conn->close();
        exit;
    }
} else {
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
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Student not found for password retrieval."]);
        $conn->close();
        exit;
    }
    $stmt_fetch_pw->close();
}

// --- Image Upload Logic ---
$new_image_filename = null;
$image_uploaded_this_request = false;

if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $file_tmp_name = $_FILES["image"]["tmp_name"];
    $file_name_original = basename($_FILES["image"]["name"]);
    $file_extension = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($file_extension, $allowed_extensions)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid image file type. Allowed: " . implode(', ', $allowed_extensions)]);
        $conn->close();
        exit;
    }

    $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Server error: Failed to create upload directory. Check server permissions."]);
            $conn->close();
            exit;
        }
    }

    $new_image_filename = uniqid("student_") . "_" . $file_name_original;
    $uploadPath = $uploadDir . $new_image_filename;

    if (move_uploaded_file($file_tmp_name, $uploadPath)) {
        deleteOldImage($conn, $student_id);
        $image_uploaded_this_request = true;
    } else {
        $php_error_message = error_get_last();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Image upload failed: Could not move file. " . ($php_error_message ? $php_error_message['message'] : 'Check directory permissions for ' . $uploadDir)]);
        $conn->close();
        exit;
    }
} else if (isset($_FILES["image"]) && $_FILES["image"]["error"] !== UPLOAD_ERR_NO_FILE) {
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
    $stmt_fetch_current_image = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
    if ($stmt_fetch_current_image === false) {
        // Log this error if you have a log, but don't exit, we can proceed without updating image
    } else {
        $stmt_fetch_current_image->bind_param("i", $student_id);
        $stmt_fetch_current_image->execute();
        $result_current_image = $stmt_fetch_current_image->get_result();
        if ($row_current_image = $result_current_image->fetch_assoc()) {
            $new_image_filename = $row_current_image['image'];
        }
        $stmt_fetch_current_image->close();
    }
}

// --- Start Database Transaction ---
$conn->begin_transaction();

try {
    // 1. Update main student table
    $query_student = "UPDATE student SET
                email = ?, password = ?, firstname = ?, middlename = ?, lastname = ?,
                date_of_birth = ?, contact_number = ?, street = ?, city = ?, province = ?,
                zipcode = ?, country = ?, image = ?
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

    // 2. Handle student_details (Enrollments)
    // Get current enrollments from DB to compare with new ones
    $current_db_enrollments = [];
    $stmt_current_enrollments = $conn->prepare("SELECT student_details_id, section_id, instructor_id, program_details_id FROM student_details WHERE student_id = ?");
    if ($stmt_current_enrollments === false) {
        throw new Exception("Failed to prepare current enrollments fetch: " . $conn->error);
    }
    $stmt_current_enrollments->bind_param("i", $student_id);
    $stmt_current_enrollments->execute();
    $result_current_enrollments = $stmt_current_enrollments->get_result();
    while ($row = $result_current_enrollments->fetch_assoc()) {
        $current_db_enrollments[$row['student_details_id']] = $row;
    }
    $stmt_current_enrollments->close();

    $processed_enrollment_ids = [];

    foreach ($enrollments_data as $enrollment) {
        $sd_id = $enrollment['student_details_id'] ?? null; // ID will be present for existing enrollments
        $section_id = intval($enrollment['section_id'] ?? 0);
        $instructor_id = intval($enrollment['instructor_id'] ?? 0);
        $program_details_id = intval($enrollment['program_details_id'] ?? 0);

        // Basic validation for enrollment data
        if (empty($section_id) || empty($instructor_id) || empty($program_details_id)) {
            throw new Exception("Invalid enrollment data provided (missing section, instructor, or program ID).");
        }

        if ($sd_id && isset($current_db_enrollments[$sd_id])) {
            // This is an existing enrollment, check if it needs update
            $current_db_row = $current_db_enrollments[$sd_id];

            if (
                $current_db_row['section_id'] != $section_id ||
                $current_db_row['instructor_id'] != $instructor_id ||
                $current_db_row['program_details_id'] != $program_details_id
            ) {
                // Update existing student_details record
                $stmt_update_sd = $conn->prepare("UPDATE student_details SET section_id = ?, instructor_id = ?, program_details_id = ? WHERE student_details_id = ? AND student_id = ?");
                if ($stmt_update_sd === false) {
                    throw new Exception("Failed to prepare student_details update statement: " . $conn->error);
                }
                $stmt_update_sd->bind_param("iiiii", $section_id, $instructor_id, $program_details_id, $sd_id, $student_id);
                $stmt_update_sd->execute();
                $stmt_update_sd->close();
            }
            $processed_enrollment_ids[] = $sd_id; // Mark as processed
        } else {
            // This is a new enrollment, insert it
            $stmt_insert_sd = $conn->prepare("INSERT INTO student_details (student_id, section_id, instructor_id, program_details_id) VALUES (?, ?, ?, ?)");
            if ($stmt_insert_sd === false) {
                throw new Exception("Failed to prepare student_details insert statement: " . $conn->error);
            }
            $stmt_insert_sd->bind_param("iiii", $student_id, $section_id, $instructor_id, $program_details_id);
            $stmt_insert_sd->execute();
            $stmt_insert_sd->close();
            // We don't add new ID to processed_enrollment_ids here, as we only need to delete old ones
        }
    }

    // 3. Delete enrollments that were not sent in the update request (i.e., removed by user)
    $enrollments_to_delete = array_diff(array_keys($current_db_enrollments), $processed_enrollment_ids);

    if (!empty($enrollments_to_delete)) {
        $placeholders = implode(',', array_fill(0, count($enrollments_to_delete), '?'));
        $delete_query = "DELETE FROM student_details WHERE student_details_id IN ($placeholders) AND student_id = ?";
        $stmt_delete_sd = $conn->prepare($delete_query);
        if ($stmt_delete_sd === false) {
            throw new Exception("Failed to prepare student_details delete statement: " . $conn->error);
        }

        $types = str_repeat('i', count($enrollments_to_delete)) . 'i'; // All are integers
        $params = array_merge($enrollments_to_delete, [$student_id]);
        $stmt_delete_sd->bind_param($types, ...$params);
        $stmt_delete_sd->execute();
        $stmt_delete_sd->close();
    }


    $conn->commit();

    // Fetch updated info to return to the frontend (similar to student_get_api.php)
    // You might want to return the full student object with all enrollments here
    $response_student = [];
    $query_student_fetch = "
        SELECT 
            student_id, email, firstname, middlename, lastname, date_of_birth,
            contact_number, street, city, province, zipcode, country, image
        FROM student
        WHERE student_id = ?
    ";
    $stmt_fetch_student = $conn->prepare($query_student_fetch);
    $stmt_fetch_student->bind_param("i", $student_id);
    $stmt_fetch_student->execute();
    $result_fetch_student = $stmt_fetch_student->get_result();
    $response_student = $result_fetch_student->fetch_assoc();
    $stmt_fetch_student->close();
    unset($response_student["password"]); // Remove password for security

    $query_enrollments_fetch = "
        SELECT 
            sd.student_details_id,
            sd.instructor_id,
            sd.section_id,
            sd.program_details_id,
            sec.year_level_id,
            sec.semester_id,
            sec.section_name,
            inst.firstname AS instructor_firstname,
            inst.lastname AS instructor_lastname,
            p.program_name
        FROM 
            student_details sd
        JOIN 
            section sec ON sd.section_id = sec.section_id
        JOIN 
            instructor inst ON sd.instructor_id = inst.instructor_id
        JOIN 
            program_details pd ON sd.program_details_id = pd.program_details_id
        JOIN
            program p ON pd.program_id = p.program_id
        WHERE 
            sd.student_id = ?
    ";
    $stmt_fetch_enrollments = $conn->prepare($query_enrollments_fetch);
    $stmt_fetch_enrollments->bind_param("i", $student_id);
    $stmt_fetch_enrollments->execute();
    $result_fetch_enrollments = $stmt_fetch_enrollments->get_result();
    $response_enrollments = [];
    while ($row = $result_fetch_enrollments->fetch_assoc()) {
        $response_enrollments[] = $row;
    }
    $stmt_fetch_enrollments->close();

    $response_student['enrollments'] = $response_enrollments;

    echo json_encode(["success" => true, "message" => "Student and enrollments updated successfully!", "student" => $response_student]);

} catch (Exception $e) {
    $conn->rollback();
    if ($image_uploaded_this_request && file_exists($uploadPath)) {
        unlink($uploadPath);
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Transaction Failed: " . $e->getMessage()]);
}

$conn->close();
?>