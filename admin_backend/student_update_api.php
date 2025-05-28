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
    parse_str(file_get_contents("php://input"), $put_vars);

    if (!isset($_GET['student_id'])) {
        http_response_code(400);
        echo json_encode(["message" => "Missing student_id"]);
        exit();
    }
    $student_id = intval($_GET['student_id']);

    // Because PUT + multipart is tricky, better to accept POST with _method=PUT or
    // Use POST method for updates if possible, or switch to AJAX with JSON payload without file upload.

    // For simplicity, consider changing to POST for update if you want file upload.

    http_response_code(400);
    echo json_encode(["message" => "PUT method with multipart/form-data is not supported by PHP by default. Use POST instead."]);
    exit();
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle update on POST instead

    if (!isset($_GET['student_id'])) {
        http_response_code(400);
        echo json_encode(["message" => "Missing student_id"]);
        exit();
    }
    $student_id = intval($_GET['student_id']);

    $firstname = $_POST['firstname'] ?? '';
    $middlename = $_POST['middlename'] ?? '';
    $lastname = $_POST['lastname'] ?? '';
    $date_of_birth = $_POST['date_of_birth'] ?? '';
    $contact_number = $_POST['contact_number'] ?? '';
    $email = $_POST['email'] ?? '';
    $street = $_POST['street'] ?? '';
    $city = $_POST['city'] ?? '';
    $province = $_POST['province'] ?? '';
    $zipcode = $_POST['zipcode'] ?? '';
    $country = $_POST['country'] ?? '';
    $instructor_id = $_POST['instructor_id'] ?? null;
    $program_details_id = $_POST['program_details_id'] ?? null;
    $section_id = $_POST['section_id'] ?? null;

    // Initialize an array to hold parts of the SQL query for dynamic updates
    $update_fields = [];
    $bind_params = [];
    $bind_types = "";

    // Add fields from POST to update if they are not empty
    if (!empty($firstname)) { $update_fields[] = "firstname=?"; $bind_params[] = $firstname; $bind_types .= "s"; }
    if (!empty($middlename)) { $update_fields[] = "middlename=?"; $bind_params[] = $middlename; $bind_types .= "s"; }
    if (!empty($lastname)) { $update_fields[] = "lastname=?"; $bind_params[] = $lastname; $bind_types .= "s"; }
    if (!empty($date_of_birth)) { $update_fields[] = "date_of_birth=?"; $bind_params[] = $date_of_birth; $bind_types .= "s"; }
    if (!empty($contact_number)) { $update_fields[] = "contact_number=?"; $bind_params[] = $contact_number; $bind_types .= "s"; }
    if (!empty($email)) { $update_fields[] = "email=?"; $bind_params[] = $email; $bind_types .= "s"; }
    if (!empty($street)) { $update_fields[] = "street=?"; $bind_params[] = $street; $bind_types .= "s"; }
    if (!empty($city)) { $update_fields[] = "city=?"; $bind_params[] = $city; $bind_types .= "s"; }
    if (!empty($province)) { $update_fields[] = "province=?"; $bind_params[] = $province; $bind_types .= "s"; }
    if (!empty($zipcode)) { $update_fields[] = "zipcode=?"; $bind_params[] = $zipcode; $bind_types .= "s"; }
    if (!empty($country)) { $update_fields[] = "country=?"; $bind_params[] = $country; $bind_types .= "s"; }

    $success = true; // Assume success until an error occurs

    // Update student table if there are fields to update
    if (!empty($update_fields)) {
        $sql = "UPDATE student SET " . implode(", ", $update_fields) . " WHERE student_id=?";
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            // Add student_id to bind parameters
            $bind_params[] = $student_id;
            $bind_types .= "i";

            $stmt->bind_param($bind_types, ...$bind_params);
            $success = $stmt->execute();
            $stmt->close();
        } else {
            $success = false;
            error_log("Failed to prepare statement for student update: " . $conn->error);
        }
    }

    // Update student_details table
    if ($instructor_id !== null || $program_details_id !== null || $section_id !== null) {
        $update_details_fields = [];
        $bind_details_params = [];
        $bind_details_types = "";

        if ($instructor_id !== null) { $update_details_fields[] = "instructor_id=?"; $bind_details_params[] = $instructor_id; $bind_details_types .= "i"; }
        if ($program_details_id !== null) { $update_details_fields[] = "program_details_id=?"; $bind_details_params[] = $program_details_id; $bind_details_types .= "i"; }
        if ($section_id !== null) { $update_details_fields[] = "section_id=?"; $bind_details_params[] = $section_id; $bind_details_types .= "i"; }

        if (!empty($update_details_fields)) {
            $sql2 = "UPDATE student_details SET " . implode(", ", $update_details_fields) . " WHERE student_id=?";
            $stmt2 = $conn->prepare($sql2);
            if ($stmt2) {
                $bind_details_params[] = $student_id;
                $bind_details_types .= "i";

                $stmt2->bind_param($bind_details_types, ...$bind_details_params);
                $success = $success && $stmt2->execute();
                $stmt2->close();
            } else {
                $success = false;
                error_log("Failed to prepare statement for student_details update: " . $conn->error);
            }
        }
    }

    // Handle image upload if exists
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $target_dir = __DIR__ . '/../uploads/';
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        $filename = basename($_FILES["image"]["name"]);
        $target_file = $target_dir . $filename;
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $imagePath = $filename;
            $stmt3 = $conn->prepare("UPDATE student SET image=? WHERE student_id=?");
            $stmt3->bind_param("si", $imagePath, $student_id);
            $success = $success && $stmt3->execute();
            $stmt3->close();
        } else {
            error_log("Failed to move uploaded file");
            $success = false;
        }
    } else if (isset($_FILES['image'])) {
        // If image is set but has an error
        error_log("Image upload error code: " . $_FILES['image']['error']);
        $success = false;
    }

    // Respond with success or failure
    if ($success) {
        echo json_encode(["message" => "Student updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to update student"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}

$conn->close();
?>