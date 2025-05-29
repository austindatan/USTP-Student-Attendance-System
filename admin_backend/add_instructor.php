<?php
header('Content-Type: application/json');

header("Access-Control-Allow-Origin: *");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

$instructor_id = $_POST['instructor_id'];
$email = $_POST['email'];

$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$firstname = $_POST['firstname'];
$middlename = $_POST['middlename'];
$lastname = $_POST['lastname'];
$date_of_birth = $_POST['date_of_birth'];
$contact_number = $_POST['contact_number'];
$street = $_POST['street'];
$city = $_POST['city'];
$province = $_POST['province'];
$zipcode = $_POST['zipcode'];
$country = $_POST['country'];

$imageName = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageTmp = $_FILES['image']['tmp_name'];

    $imageName = uniqid() . '_' . basename($_FILES['image']['name']);

    $uploadDir = __DIR__ . '/../api/uploads/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    move_uploaded_file($imageTmp, $uploadDir . $imageName);
}

$stmt = $conn->prepare("INSERT INTO instructor (
    instructor_id, email, password, firstname, middlename, lastname,
    date_of_birth, contact_number, street, city, province, zipcode, country, image
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "ssssssssssssss",
    $instructor_id, $email, $password, $firstname, $middlename, $lastname,
    $date_of_birth, $contact_number, $street, $city, $province, $zipcode, $country, $imageName
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Instructor added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to insert instructor"]);
}
?>