<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php'; 

$data = json_decode(file_get_contents("php://input"));

$course_id = $data->course_id ?? null;
$course_name = trim($data->course_name ?? '');
$description = trim($data->description ?? '');

if (!$course_id || !$course_name || !$description) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields."
    ]);
    exit;
}

$sql = "UPDATE course SET course_name = ?, description = ? WHERE course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $course_name, $description, $course_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Course updated successfully."
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
