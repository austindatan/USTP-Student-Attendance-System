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

    // Update student table
    $stmt = $conn->prepare("UPDATE student SET firstname=?, middlename=?, lastname=?, date_of_birth=?, contact_number=?, email=?, street=?, city=?, province=?, zipcode=?, country=? WHERE student_id=?");
    $stmt->bind_param("sssssssssssi",
        $firstname, $middlename, $lastname, $date_of_birth, $contact_number, $email, $street, $city, $province, $zipcode, $country, $student_id
    );
    $success = $stmt->execute();
    $stmt->close();

    // Update student_details table
    if ($instructor_id !== null && $program_details_id !== null && $section_id !== null) {
        $stmt2 = $conn->prepare("UPDATE student_details SET instructor_id=?, program_details_id=?, section_id=? WHERE student_id=?");
        $stmt2->bind_param("iiii", $instructor_id, $program_details_id, $section_id, $student_id);
        $success = $success && $stmt2->execute();
        $stmt2->close();
    }

    // Handle image upload if exists
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $target_dir = __DIR__ . '/../uploads/student_images/';
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        $filename = basename($_FILES["image"]["name"]);
        $target_file = $target_dir . $filename;
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            // Save path to DB if needed
            // Example: update student_images table or student table image column
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to upload image"]);
            exit();
        }
    }

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
