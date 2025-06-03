<?php
header("Content-Type: application/json");

// Allow requests from your React development server
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
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

    // Optional: Delete the uploaded image file if it exists
    $stmtFile = $conn->prepare("SELECT file_path FROM excused_request WHERE excused_request_id = ?");
    $stmtFile->bind_param("i", $excused_request_id);
    $stmtFile->execute();
    $stmtFile->bind_result($file_path);
    if ($stmtFile->fetch() && $file_path) {
        // Construct the absolute path to the file.
        // Assuming file_path in DB is like 'uploads/filename.ext'
        // and this script is in 'instructor_backend/'
        // We need to go up two directories (../..), then into 'uploads/'
        $file_to_delete = __DIR__ . '/../../' . $file_path;
        
        if (file_exists($file_to_delete)) {
            unlink($file_to_delete); // Delete the file
        } else {
            // Log if file doesn't exist to aid debugging, but don't stop execution
            error_log("Attempted to delete file but it did not exist: " . $file_to_delete);
        }
    }
    $stmtFile->close();

    // Delete the excuse request from the database
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