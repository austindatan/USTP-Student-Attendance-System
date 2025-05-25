<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['student_id'])) {
    $student_id = $_GET['student_id'];
    
    $stmt = $conn->prepare("SELECT student.student_id, student.firstname, student.middlename, student.lastname, student.date_of_birth, student.contact_number FROM drop_request 
                            INNER JOIN attendance ON attendance.attendance_id = drop_request.attendance_id
                            INNER JOIN student ON student.student_id = attendance.student_id
                            WHERE drop_request.status !='Dropped' AND student_id = ?");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Student not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Bad Request"]);
}
?>