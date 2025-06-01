<?php
// get_student_excuse_requests.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Consider restricting this to your frontend's origin in a production environment
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure LOG_PREFIX is defined if used in conn.php for error_log
if (!defined('LOG_PREFIX')) {
    define('LOG_PREFIX', '[APP_ERROR] ');
}

// Include your database connection file that provides the $conn (MySQLi) object
require_once(__DIR__ . "/../../src/conn.php");

// Check if the MySQLi connection was successful
if ($conn->connect_error) {
    error_log(LOG_PREFIX . " Database connection failed: " . $conn->connect_error);
    echo json_encode(["success" => false, "message" => "Database connection failed."]); // Consistent error message
    exit;
}

$student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;

if ($student_id === 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID is required.']);
    // Close the connection before exiting
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

    // Use MySQLi's prepare method
    $stmt = $conn->prepare($sql);

    // Check if prepare was successful
    if ($stmt === false) {
        error_log(LOG_PREFIX . " MySQLi Prepare failed: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement.']);
        // Close connection and exit
        $conn->close();
        exit();
    }

    // Bind the student_id parameter
    $stmt->bind_param('i', $student_id); // 'i' for integer type

    // Execute the statement
    $stmt->execute();

    // Get the result set
    $result = $stmt->get_result();

    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }

    // Close the statement
    $stmt->close();

    if (!empty($requests)) {
        echo json_encode(['success' => true, 'requests' => $requests]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No excuse requests found for this student.']);
    }

} catch (Exception $e) { // Catch general exceptions for robustness
    error_log(LOG_PREFIX . " General error fetching student requests: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()]);
} finally {
    // Ensure the connection is closed
    if ($conn) {
        $conn->close();
    }
}
?>