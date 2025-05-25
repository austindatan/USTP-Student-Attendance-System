<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize input fields
    $fields = ['firstname', 'middlename', 'lastname', 'date_of_birth', 'contact_number', 'email', 'password', 'street', 'city', 'province', 'zipcode', 'country'];
    foreach ($fields as $field) {
        $$field = isset($_POST[$field]) ? $conn->real_escape_string($_POST[$field]) : '';
    }

    // Handle image upload
    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = uniqid() . "_" . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $imagePath = 'uploads/' . $filename;
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to upload image."]);
            exit();
        }
    }

    $sql = "INSERT INTO student (email, password, firstname, middlename, lastname, date_of_birth, contact_number, street, city, province, zipcode, country, image)
            VALUES ('$email', '$password', '$firstname', '$middlename', '$lastname', '$date_of_birth', '$contact_number', '$street', '$city', '$province', '$zipcode', '$country', '$imagePath')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Student added successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to add student", "error" => $conn->error]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>
