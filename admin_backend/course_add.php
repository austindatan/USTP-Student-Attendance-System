<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php'; 

$data = json_decode(file_get_contents("php://input"));

$course_name = trim($data->course_name ?? '');
$description = trim($data->description ?? '');

if (empty($course_name) || empty($description)) {
    echo json_encode([
        "success" => false,
        "message" => "Course name and description are required."
    ]);
    exit;
}

$prefix = strtoupper(preg_replace('/[^A-Z]/i', '', $course_name));
$prefix = substr($prefix, 0, 4);
$code_query = "SELECT COUNT(*) as count FROM course WHERE course_code LIKE ?";
$like_prefix = $prefix . '%';
$stmt = $conn->prepare($code_query);
$stmt->bind_param("s", $like_prefix);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$count = (int)$row['count'];
$course_code = $prefix . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);


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
