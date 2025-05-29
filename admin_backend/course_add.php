<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php';

$data = json_decode(file_get_contents("php://input"));

$course_code = trim($data->course_code ?? '');
$course_name = trim($data->course_name ?? '');
$description = trim($data->description ?? '');

if (empty($course_code) || empty($course_name) || empty($description)) {
    echo json_encode([
        "success" => false,
        "message" => "Course code, name, and description are all required."
    ]);
    exit;
}

$check_sql = "SELECT COUNT(*) FROM course WHERE course_code = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $course_code);
$check_stmt->execute();
$check_stmt->bind_result($count);
$check_stmt->fetch();
$check_stmt->close();

if ($count > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Course code already exists. Please use a different one."
    ]);
    exit;
}

$sql = "INSERT INTO course (course_code, course_name, description) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $course_code, $course_name, $description);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Course added successfully.",
        "course_code" => $course_code 
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>