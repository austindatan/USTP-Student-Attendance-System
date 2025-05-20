<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$conn = new mysqli("localhost", "root", "austinreverie", "attendance_monitoring");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = $_POST;
$imagePath = '';

if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $targetDir = "../uploads/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    $imageName = uniqid() . "_" . basename($_FILES["image"]["name"]);
    $targetFilePath = $targetDir . $imageName;

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
        $imagePath = "uploads/" . $imageName;
    }
}

$sql = "INSERT INTO instructor (email, password, firstname, middlename, lastname, date_of_birth, contact_number, street, city, province, zipcode, country, image)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssssssssssss",
    $data["email"],
    password_hash($data["password"], PASSWORD_DEFAULT),
    $data["firstname"],
    $data["middlename"],
    $data["lastname"],
    $data["date_of_birth"],
    $data["contact_number"],
    $data["street"],
    $data["city"],
    $data["province"],
    $data["zipcode"],
    $data["country"],
    $imagePath
);

$response = [];

if ($stmt->execute()) {
    $response = ["success" => true, "message" => "Instructor registered successfully."];
} else {
    $response = [
        "success" => false,
        "message" => "Registration failed: " . $stmt->error
    ];
}
echo json_encode($response);

$conn->close();