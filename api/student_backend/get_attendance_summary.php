<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

define('LOG_PREFIX', '[ATTENDANCE_API_SUMMARY]');

require_once("../../src/conn.php");

if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
error_log(LOG_PREFIX . " Received raw input: " . print_r($input, true));

if (!isset($input['student_id'])) {
    error_log(LOG_PREFIX . " Error: Missing student_id in request input.");
    echo json_encode(["error" => "Missing student_id"]);
    exit;
}

$student_id = $input['student_id'];

error_log(LOG_PREFIX . " Processing attendance summary for student_id: '{$student_id}'");

// SQL query
$sql = "
    SELECT 
        c.course_name AS course,
        i.fullname AS teacher,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent,
        SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) AS late,
        SUM(CASE WHEN a.status = 'Excused' THEN 1 ELSE 0 END) AS excused
    FROM attendance a
    INNER JOIN student_details sd ON a.student_details_id = sd.student_details_id
    INNER JOIN student s ON sd.student_id = s.student_id
    INNER JOIN class c ON a.class_id = c.class_id
    INNER JOIN instructor i ON c.instructor_id = i.instructor_id
    WHERE s.student_id = ?
    GROUP BY c.course_name, i.fullname
    ORDER BY c.course_name
";

if (!$stmt = $conn->prepare($sql)) {
    error_log(LOG_PREFIX . " Failed to prepare statement. MySQL Error: " . $conn->error);
    echo json_encode(["error" => "SQL prepare failed", "mysql_error" => $conn->error]);
    exit;
}

$stmt->bind_param("s", $student_id);

if (!$stmt->execute()) {
    error_log(LOG_PREFIX . " Failed to execute statement. Error: " . $stmt->error);
    echo json_encode(["error" => "SQL execute failed", "mysql_error" => $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = [
        "course" => $row['course'],
        "teacher" => $row['teacher'],
        "present" => (int) $row['present'],
        "absent" => (int) $row['absent'],
        "late" => (int) $row['late'],
        "excused" => (int) $row['excused']
    ];
}

echo json_encode($data);

$stmt->close();
$conn->close();
?>