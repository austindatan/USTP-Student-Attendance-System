<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    $drop_req_id = $data['drop_request_id'];
    $status = $data['status'];

    $stmt = $conn->prepare("UPDATE drop_request SET status=? WHERE drop_request_id=?");
    $stmt->bind_param("si", $status, $drop_req_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Drop request status updated successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update drop request", "details" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
