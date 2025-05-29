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

$student_details_id = $_POST['student_details_id'];
$instructor_id = $_POST['instructor_id'];
$reason = $_POST['reason'];
$date_of_absence = $_POST['date_of_absence'];
$date_requested = date('Y-m-d');


$file_path = null;
if (isset($_FILES['file'])) {
    $targetDir = "uploads/";
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    $file_name = basename($_FILES["file"]["name"]);
    $targetFilePath = $targetDir . time() . "_" . $file_name;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
        $file_path = $targetFilePath;
    }
}

$sql = "INSERT INTO excused_request (student_details_id, reason, date_requested, date_of_absence, status, file_path)
        VALUES (?, ?, ?, ?, 'Pending', ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("issss", $student_details_id, $reason, $date_requested, $date_of_absence, $file_path);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Excuse request submitted successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to submit excuse request."
    ]);
}


$stmt->close();
$conn->close();
?>