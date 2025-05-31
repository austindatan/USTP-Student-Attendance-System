<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

define('LOG_PREFIX', '[ATTENDANCE_API_ABSENT]');

require_once(__DIR__ . "/../../src/conn.php");

if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

if (!isset($_GET['student_id']) || !isset($_GET['course_code'])) {
    error_log(LOG_PREFIX . " Error: Missing student_id or course_code in request input.");
    echo json_encode(["error" => "Missing student_id or course_code"]);
    exit;
}

$student_id = $_GET['student_id'];
$course_code = $_GET['course_code'];
$year = (int) date("Y");

error_log(LOG_PREFIX . " Processing request for student_id: '{$student_id}', course_code: '{$course_code}' for year: {$year}");

// Query for total count
$sql_count = "
    SELECT COUNT(a.attendance_id) AS total_absent
    FROM attendance a
    INNER JOIN student_details sd ON a.student_details_id = sd.student_details_id
    INNER JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
    INNER JOIN course c ON sc.course_id = c.course_id
    WHERE sd.student_id = ?
      AND c.course_code = ?
      AND a.status = 'Absent'
      AND YEAR(a.date) = ?
";

// Query for specific dates
$sql_dates = "
    SELECT DATE_FORMAT(a.date, '%Y-%m-%d') AS attendance_date
    FROM attendance a
    INNER JOIN student_details sd ON a.student_details_id = sd.student_details_id
    INNER JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
    INNER JOIN course c ON sc.course_id = c.course_id
    WHERE sd.student_id = ?
      AND c.course_code = ?
      AND a.status = 'Absent'
      AND YEAR(a.date) = ?
";

$response_data = ["total_absent" => 0, "absent_dates" => []];

// Fetch count
if ($stmt_count = $conn->prepare($sql_count)) {
    $stmt_count->bind_param("ssi", $student_id, $course_code, $year);
    if ($stmt_count->execute()) {
        $result_count = $stmt_count->get_result();
        if ($row_count = $result_count->fetch_assoc()) {
            $response_data["total_absent"] = (int) $row_count['total_absent'];
        }
    } else {
        error_log(LOG_PREFIX . " Failed to execute count statement. Error: " . $stmt_count->error);
    }
    $stmt_count->close();
} else {
    error_log(LOG_PREFIX . " Failed to prepare count statement. MySQL Error: " . $conn->error);
}

// Fetch dates
if ($stmt_dates = $conn->prepare($sql_dates)) {
    $stmt_dates->bind_param("ssi", $student_id, $course_code, $year);
    if ($stmt_dates->execute()) {
        $result_dates = $stmt_dates->get_result();
        $dates_array = [];
        while ($row_date = $result_dates->fetch_assoc()) {
            $dates_array[] = $row_date['attendance_date'];
        }
        $response_data["absent_dates"] = $dates_array;
    } else {
        error_log(LOG_PREFIX . " Failed to execute dates statement. Error: " . $stmt_dates->error);
    }
    $stmt_dates->close();
} else {
    error_log(LOG_PREFIX . " Failed to prepare dates statement. MySQL Error: " . $conn->error);
}

echo json_encode($response_data);

$conn->close();
?>