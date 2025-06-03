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

function deleteOldImage($conn, $student_id) {
    $stmt = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
    if ($stmt === false) {
        error_log("Failed to prepare statement for old image fetch: " . $conn->error);
        return; 
    }
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $oldImage = $row["image"];
        if ($oldImage && file_exists("uploads/" . $oldImage)) {
            if (!unlink("uploads/" . $oldImage)) {
                error_log("Failed to delete old image: uploads/" . $oldImage);
            }
        }
    }
    $stmt->close();
}

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

// validation
if (empty($student_id)) {
    echo json_encode(["success" => false, "message" => "Missing student ID for update."]);
    $conn->close();
    exit;
}

$new_image_filename = null; 
$image_uploaded = false;

// Checks if image is sent
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $file_tmp_name = $_FILES["image"]["tmp_name"];
    $file_name = basename($_FILES["image"]["name"]);
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($file_extension, $allowed_extensions)) {
        echo json_encode(["success" => false, "message" => "Invalid image file type."]);
        $conn->close();
        exit;
    }

    $uploadDir = "../uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true); 
    }

    $new_image_filename = uniqid("student_") . "_" . $file_name;
    $uploadPath = $uploadDir . $new_image_filename;

    if (move_uploaded_file($file_tmp_name, $uploadPath)) {
        deleteOldImage($conn, $student_id); // Deletes old image
        $image_uploaded = true;
    } else {
        echo json_encode(["success" => false, "message" => "Image upload failed."]);
        $conn->close();
        exit;
    }
} else if (isset($_FILES["image"]) && $_FILES["image"]["error"] !== UPLOAD_ERR_NO_FILE) {
    echo json_encode(["success" => false, "message" => "Image upload error: " . $_FILES["image"]["error"]]);
    $conn->close();
    exit;
} else {
    //retains image
    $stmt_fetch_current_image = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
    if ($stmt_fetch_current_image === false) {
        error_log("Failed to prepare statement for fetching current image: " . $conn->error);
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


$hashed_password_for_update = null;
if (!empty($password)) {
    if (strlen($password) < 60) {
        $hashed_password_for_update = password_hash($password, PASSWORD_DEFAULT);
    } else {
        $hashed_password_for_update = $password;
    }
} else {
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
        echo json_encode(["success" => false, "message" => "Student not found for password retrieval."]);
        $conn->close();
        exit;
    }
    $stmt_fetch_pw->close();
}

//update the student table query
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
    $hashed_password_for_update,
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
    $new_image_filename, 
    $student_id
];
$types = "sssssssssssssi";

$stmt = $conn->prepare($query);

if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Failed to prepare statement: " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param($types, ...$params);


if ($stmt->execute()) {
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
        unset($student["password"]); 
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
