<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

define('LOG_PREFIX', '[EXCUSED_API]');

require_once("../../src/conn.php");

if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['student_id'])) {
    echo json_encode(["error" => "Missing student_id"]);
    exit;
}

$student_id = $input['student_id'];
$year = (int) date("Y");

$sql = "
    SELECT COUNT(a.attendance_id) AS total_excused
    FROM attendance a
    INNER JOIN student_details sd ON a.student_details_id = sd.student_details_id
    INNER JOIN student s ON sd.student_id = s.student_id
    WHERE s.student_id = ?
    AND a.status = 'Excused'
    AND YEAR(a.date) = ?
";

if (!$stmt = $conn->prepare($sql)) {
    echo json_encode(["error" => "SQL prepare failed", "mysql_error" => $conn->error]);
    exit;
}

$stmt->bind_param("si", $student_id, $year);

if (!$stmt->execute()) {
    echo json_encode(["error" => "SQL execute failed", "mysql_error" => $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

$result = $stmt->get_result();

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode(["total_excused" => (int) $row['total_excused']]);
} else {
    echo json_encode(["total_excused" => 0]);
}

$stmt->close();
$conn->close();
?>