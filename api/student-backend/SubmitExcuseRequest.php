<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

include __DIR__ . '/../../src/conn.php';

$student_details_id = $_POST['student_details_id'] ?? null;
$reason = $_POST['reason'] ?? null;
$date_of_absence = $_POST['date_of_absence'] ?? null;
$date_requested = date('Y-m-d'); 

if (!$student_details_id || !$reason || !$date_of_absence) {
    echo json_encode(["success" => false, "message" => "Missing required form data."]);
    exit;
}

$student_details_id = (int)$student_details_id;

// FILE HANDLING 
$file_path = null;
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $targetDir = "uploads/";
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    $file_name = basename($_FILES["file"]["name"]);
    $targetFilePath = $targetDir . uniqid() . "_" . preg_replace("/[^a-zA-Z0-9_.-]/", "", $file_name);

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
        $file_path = $targetFilePath;
    } else {
        error_log("Failed to move uploaded file: " . $_FILES["file"]["tmp_name"] . " to " . $targetFilePath);
        
    }
}

$sql = "
    INSERT INTO excused_request
        (student_details_id, reason, date_requested, date_of_absence, status, file_path)
    VALUES
        (?, ?, ?, ?, 'Pending', ?)
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("issss", $student_details_id, $reason, $date_requested, $date_of_absence, $file_path);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Excuse request submitted successfully."]);
} else {
    error_log("Failed to insert excuse request: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Failed to submit excuse request. Database error."]);
}

$stmt->close();
$conn->close();
?>