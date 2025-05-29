<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "attendance_monitoring");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

function deleteOldImage($conn, $instructor_id) {
    $stmt = $conn->prepare("SELECT image FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $oldImage = $row["image"];
        if ($oldImage && file_exists("uploads/" . $oldImage)) {
            unlink("uploads/" . $oldImage);
        }
    }
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

if (empty($_POST['instructor_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing instructor ID.']);
    exit;
}
$instructor_id = $_POST['instructor_id'];

$imageName = null;
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $imageTmp = $_FILES["image"]["tmp_name"];
    $imageName = uniqid("instructor_") . "_" . basename($_FILES["image"]["name"]);
    $uploadDir = "uploads/";
    $uploadPath = $uploadDir . $imageName;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (move_uploaded_file($imageTmp, $uploadPath)) {
        deleteOldImage($conn, $instructor_id);
    } else {
        echo json_encode(["success" => false, "message" => "Image upload failed."]);
        exit;
    }
}

if (!empty($password) && strlen($password) < 60) {
    $password = password_hash($password, PASSWORD_DEFAULT);
} else {
    $stmt = $conn->prepare("SELECT password FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $password = $row["password"];
    }
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
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    $stmt = $conn->prepare("SELECT * FROM instructor WHERE instructor_id = ?");
    $stmt->bind_param("i", $instructor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($instructor = $result->fetch_assoc()) {
        unset($instructor["password"]);
        echo json_encode(["success" => true, "instructor" => $instructor]);
    } else {
        echo json_encode(["success" => false, "message" => "Updated, but fetch failed."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Update failed: " . $stmt->error]);
}

$conn->close();