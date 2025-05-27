<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "austinreverie", "attendance_monitoring");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? '';
$password = $data["password"] ?? '';

$query = $conn->prepare("SELECT * FROM instructor WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

$response = [];

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row["password"])) {
        unset($row["password"]);
        $response = [
            "success" => true,
            "instructor" => $row
        ];
    } else {
        $response = ["success" => false, "message" => "Incorrect password"];
    }
} else {
    $response = ["success" => false, "message" => "Instructor not found"];
}

echo json_encode($response);
$conn->close();
