<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET"); 
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../../src/conn.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $course_id = $_GET['id'] ?? null;

    if (!$course_id) {
        echo json_encode(["success" => false, "message" => "Course ID is required."]);
        exit;
    }

    $sql = "SELECT course_id, course_code, course_name, description FROM course WHERE course_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $course = $result->fetch_assoc();

    if ($course) {
        echo json_encode($course);
    } else {
        echo json_encode(["success" => false, "message" => "Course not found."]);
    }

    $stmt->close();
    $conn->close();
    exit;
}

// Handle POST request to update course details
$data = json_decode(file_get_contents("php://input"));

$course_id = $data->course_id ?? null;
$course_code = trim($data->course_code ?? ''); 
$course_name = trim($data->course_name ?? '');
$description = trim($data->description ?? '');

if (!$course_id || empty($course_code) || empty($course_name) || empty($description)) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields: Course ID, Course Code, Course Name, or Description."
    ]);
    exit;
}

$check_duplicate_sql = "SELECT course_id FROM course WHERE course_code = ? AND course_id != ?";
$check_duplicate_stmt = $conn->prepare($check_duplicate_sql);
$check_duplicate_stmt->bind_param("si", $course_code, $course_id);
$check_duplicate_stmt->execute();
$check_duplicate_stmt->store_result();
if ($check_duplicate_stmt->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "The course code '" . htmlspecialchars($course_code) . "' already exists for another course. Please choose a unique code."
    ]);
    $check_duplicate_stmt->close();
    $conn->close();
    exit;
}
$check_duplicate_stmt->close();


// Update the SQL query 
$sql = "UPDATE course SET course_code = ?, course_name = ?, description = ? WHERE course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssi", $course_code, $course_name, $description, $course_id); 

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