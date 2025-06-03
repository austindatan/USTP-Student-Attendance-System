<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../../src/conn.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['excused_request_id'])) {
        echo json_encode(["success" => false, "message" => "Missing request ID."]);
        exit;
    }

    $excused_request_id = $data['excused_request_id'];

    // Deletes the uploaded image
    $stmtFile = $conn->prepare("SELECT file_path FROM excused_request WHERE excused_request_id = ?");
    $stmtFile->bind_param("i", $excused_request_id);
    $stmtFile->execute();
    $stmtFile->bind_result($file_path);
    if ($stmtFile->fetch() && $file_path) {
        $file_to_delete = __DIR__ . '/../../' . $file_path;
        
        if (file_exists($file_to_delete)) {
            unlink($file_to_delete); 
        } else {
            error_log("Attempted to delete file but it did not exist: " . $file_to_delete);
        }
    }
    $stmtFile->close();

    // Deletes the excuse request
    $stmt = $conn->prepare("DELETE FROM excused_request WHERE excused_request_id = ?");
    $stmt->bind_param("i", $excused_request_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Excuse request deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "No record deleted or record not found."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>