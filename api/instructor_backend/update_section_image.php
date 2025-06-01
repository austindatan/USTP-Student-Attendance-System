<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$section_course_id = $data['section_course_id'] ?? null;
$image_path = $data['image_path'] ?? null; // Expecting the full relative path from root, e.g., 'uploads/section_images/classes_vector_2.png'

if (!$section_course_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Section course ID is required.']);
    exit;
}

if (!$image_path) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Image path is required.']);
    exit;
}

// Optional: Validate if the image_path refers to one of your allowed images
// You could have a predefined list in PHP as well, or just trust the frontend.
$allowedImagePaths = [
    'classes_vector_2.png',
    'classes_vector_3.png',
    'classes_vector_7.png',
    'classes_vector_5.png',
    'classes_vector_6.png',
    'classes_vector_8.png',
];

if (!in_array($image_path, $allowedImagePaths)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid image path selected.']);
    exit;
}


try {
    $conn->begin_transaction();

    // Update the database with the new image path
    $stmt_update = $conn->prepare("UPDATE section_courses SET image = ? WHERE section_course_id = ?");
    if (!$stmt_update) {
        throw new Exception("Failed to prepare update statement: " . $conn->error);
    }
    $stmt_update->bind_param("si", $image_path, $section_course_id);

    if ($stmt_update->execute()) {
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Section image updated successfully.', 'imageUrl' => $image_path]);
    } else {
        throw new Exception("Failed to update database: " . $stmt_update->error);
    }
    $stmt_update->close();

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>