<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (!defined('LOG_PREFIX')) {
    define('LOG_PREFIX', '[APP_ERROR] ');
}

require_once(__DIR__ . "/../../src/conn.php");

if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["success" => false, "message" => "Database connection failed."]); 
    exit;
}

$student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;

if ($student_id === 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID is required.']);
    $conn->close();
    exit();
}

try {
    // SQL query to retrieve excuse requests for a specific student
    $sql = "
        SELECT
            er.excused_request_id,
            c.course_name,
            CONCAT(i.firstname, ' ', i.lastname) AS instructor_name,
            er.date_requested,
            er.date_of_absence,
            er.reason,
            er.file_path,
            er.status
        FROM
            excused_request er
        JOIN
            student_details sd ON er.student_details_id = sd.student_details_id
        JOIN
            student s ON sd.student_id = s.student_id
        JOIN
            section_courses sc ON sd.section_course_id = sc.section_course_id
        JOIN
            course c ON sc.course_id = c.course_id
        JOIN
            instructor i ON sc.instructor_id = i.instructor_id
        WHERE
            s.student_id = ?
        ORDER BY
            er.date_requested DESC;
    ";

    $stmt = $conn->prepare($sql);

    // Checks if prepare was successful
    if ($stmt === false) {
        error_log(LOG_PREFIX . " MySQLi Prepare failed: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement.']);
        $conn->close();
        exit();
    }

    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }

    $stmt->close();

    if (!empty($requests)) {
        echo json_encode(['success' => true, 'requests' => $requests]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No excuse requests found for this student.']);
    }

} catch (Exception $e) { 
    error_log(LOG_PREFIX . " General error fetching student requests: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()]);
} finally {
    if ($conn) {
        $conn->close();
    }
}
?>