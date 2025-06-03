<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

function deleteOldImage($conn, $instructor_id, $uploadDir) {
    $stmt = $conn->prepare("SELECT image FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $oldImage = $row["image"];
        if ($oldImage && file_exists($uploadDir . DIRECTORY_SEPARATOR . $oldImage)) {
            unlink($uploadDir . DIRECTORY_SEPARATOR . $oldImage);
        }
    }
    $stmt->close(); 
}

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

if (empty($instructor_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing instructor ID.']);
    exit;
}

$imageName = null;
$uploadDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;

if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $imageTmp = $_FILES["image"]["tmp_name"];
    $imageName = uniqid("instructor_") . "_" . basename($_FILES["image"]["name"]);
    $uploadPath = $uploadDir . $imageName; 

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            echo json_encode(["success" => false, "message" => "Failed to create upload directory."]);
            exit;
        }
    }

    if (move_uploaded_file($imageTmp, $uploadPath)) {
        deleteOldImage($conn, $instructor_id, $uploadDir);
    } else {
        echo json_encode(["success" => false, "message" => "Image upload failed: Could not move uploaded file."]);
        exit;
    }
}

// Fetch current password
if (empty($password) || strlen($password) < 60) {
    $stmt = $conn->prepare("SELECT password FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $password = $row["password"]; // Keep old password
    } else {
        echo json_encode(["success" => false, "message" => "Instructor not found to retrieve old password."]);
        exit;
    }
    $stmt->close();
} else {
    // Hash new password
    $password = password_hash($password, PASSWORD_DEFAULT);
}


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

if ($imageName) {
    $query .= ", image = ?";
    $params[] = $imageName;
    $types .= "s";
}

$query .= " WHERE instructor_id = ?";
$params[] = $instructor_id;
$types .= "i";

$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    $stmt->close(); 
    $stmt = $conn->prepare("SELECT * FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($instructor = $result->fetch_assoc()) {
        unset($instructor["password"]); 
        echo json_encode(["success" => true, "instructor" => $instructor]);
    } else {
        echo json_encode(["success" => false, "message" => "Updated, but failed to fetch updated instructor data."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Update failed: " . $stmt->error]);
}

$stmt->close(); 
$conn->close();
?>