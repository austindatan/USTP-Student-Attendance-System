<?php
// student_update_api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['student_id'])) {
    $student_id = intval($_GET['student_id']);

    // Get data from POST request (multipart/form-data)
    $firstname = $_POST['firstname'] ?? '';
    $middlename = $_POST['middlename'] ?? '';
    $lastname = $_POST['lastname'] ?? '';
    $date_of_birth = $_POST['date_of_birth'] ?? '';
    $contact_number = $_POST['contact_number'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? ''; // Only update if provided and not empty
    $street = $_POST['street'] ?? '';
    $city = $_POST['city'] ?? '';
    $province = $_POST['province'] ?? '';
    $zipcode = $_POST['zipcode'] ?? '';
    $country = $_POST['country'] ?? '';
    
    // These are the only IDs you should update in student_details related to academic details
    $section_id = $_POST['section_id'] ?? '';
    $instructor_id = $_POST['instructor_id'] ?? '';
    $program_details_id = $_POST['program_details_id'] ?? '';

    // year_level_id and semester_id are NOT stored in student_details,
    // they are used on the frontend to FILTER sections for selection.
    // They are NOT directly updated in the database for the student.
    // So, you don't need to try to get them from $_POST here.

    // Basic validation for required fields
    if (empty($firstname) || empty($lastname) || empty($date_of_birth) || empty($contact_number) || empty($email) || empty($section_id) || empty($instructor_id) || empty($program_details_id)) {
        http_response_code(400);
        echo json_encode(["message" => "Please fill all required fields (personal info, section, instructor, program)."]);
        exit();
    }

    $conn->begin_transaction();

    try {
        // Update student table
        $update_student_sql_parts = [];
        $params_student = [];
        $types_student = "";

        // Dynamically build the update query for student table
        $update_student_sql_parts[] = "firstname = ?"; $params_student[] = $firstname; $types_student .= "s";
        $update_student_sql_parts[] = "middlename = ?"; $params_student[] = $middlename; $types_student .= "s";
        $update_student_sql_parts[] = "lastname = ?"; $params_student[] = $lastname; $types_student .= "s";
        $update_student_sql_parts[] = "date_of_birth = ?"; $params_student[] = $date_of_birth; $types_student .= "s";
        $update_student_sql_parts[] = "contact_number = ?"; $params_student[] = $contact_number; $types_student .= "s";
        $update_student_sql_parts[] = "email = ?"; $params_student[] = $email; $types_student .= "s";
        $update_student_sql_parts[] = "street = ?"; $params_student[] = $street; $types_student .= "s";
        $update_student_sql_parts[] = "city = ?"; $params_student[] = $city; $types_student .= "s";
        $update_student_sql_parts[] = "province = ?"; $params_student[] = $province; $types_student .= "s";
        $update_student_sql_parts[] = "zipcode = ?"; $params_student[] = $zipcode; $types_student .= "s";
        $update_student_sql_parts[] = "country = ?"; $params_student[] = $country; $types_student .= "s";
        
        // Handle password update only if provided and not empty
        if (!empty($password)) {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $update_student_sql_parts[] = "password = ?";
            $params_student[] = $hashed_password;
            $types_student .= "s";
        }

        $update_student_sql = "UPDATE student SET " . implode(", ", $update_student_sql_parts) . " WHERE student_id = ?";
        $params_student[] = $student_id; // Add student_id to the parameters
        $types_student .= "i"; // Add type for student_id

        $stmt_student = $conn->prepare($update_student_sql);
        // Use call_user_func_array for binding parameters dynamically
        call_user_func_array([$stmt_student, 'bind_param'], array_merge([$types_student], $params_student));
        
        if (!$stmt_student->execute()) {
            throw new Exception("Error updating student table: " . $stmt_student->error);
        }
        $stmt_student->close();


        // Update student_details table
        // We only update section_id, instructor_id, and program_details_id here
        $update_student_details_sql = "UPDATE student_details SET section_id = ?, instructor_id = ?, program_details_id = ? WHERE student_id = ?";
        $stmt_details = $conn->prepare($update_student_details_sql);
        $stmt_details->bind_param("iiii", $section_id, $instructor_id, $program_details_id, $student_id);

        if (!$stmt_details->execute()) {
            throw new Exception("Error updating student_details table: " . $stmt_details->error);
        }
        $stmt_details->close();

        // Handle image upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $file_tmp_name = $_FILES['image']['tmp_name'];
            $file_name = $_FILES['image']['name'];
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];

            if (in_array($file_ext, $allowed_ext)) {
                $unique_filename = uniqid('student_') . '.' . $file_ext;
                $upload_dir = __DIR__ . '/../uploads/student_images/'; // Use __DIR__ for absolute path
                
                // Ensure directory exists
                if (!is_dir($upload_dir)) {
                    mkdir($upload_dir, 0777, true);
                }

                $destination = $upload_dir . $unique_filename;

                if (move_uploaded_file($file_tmp_name, $destination)) {
                    // Update image path in the database
                    $update_image_sql = "UPDATE student SET image = ? WHERE student_id = ?";
                    $stmt_image = $conn->prepare($update_image_sql);
                    $stmt_image->bind_param("si", $unique_filename, $student_id);
                    if (!$stmt_image->execute()) {
                        throw new Exception("Error updating student image: " . $stmt_image->error);
                    }
                    $stmt_image->close();
                } else {
                    throw new Exception("Failed to move uploaded file.");
                }
            } else {
                throw new Exception("Invalid file type for image. Only JPG, JPEG, PNG, GIF are allowed.");
            }
        }

        $conn->commit();
        echo json_encode(["message" => "Student updated successfully!"]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["message" => $e->getMessage()]);
    }

} else {
    http_response_code(400);
    echo json_encode(["message" => "Invalid request. student_id is required."]);
}

$conn->close();
?>