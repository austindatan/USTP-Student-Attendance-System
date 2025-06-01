<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php'; // Ensure your database connection file is correctly located

$instructor_id = $_GET['instructor_id'] ?? null;

if (!$instructor_id) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT
            er.excused_request_id AS id,
            er.reason AS subject,
            CONCAT(s.firstname, ' ', s.lastname) AS sender,
            er.date_requested AS date_requested_raw -- Select the raw date for formatting in PHP
        FROM
            excused_request er
        JOIN
            student_details sd ON er.student_details_id = sd.student_details_id
        JOIN
            student s ON sd.student_id = s.student_id
        JOIN
            section_courses sc ON sd.section_course_id = sc.section_course_id
        WHERE
            sc.instructor_id = ?
        ORDER BY
            er.date_requested DESC
        LIMIT 5";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    // Log error for debugging, don't expose sensitive info to user
    error_log("Failed to prepare statement for get_recent_requests.php: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database query preparation failed."]);
    exit();
}

$stmt->bind_param("i", $instructor_id);
$stmt->execute();
$result = $stmt->get_result();

$requests = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $requests[] = [
            'id' => $row['id'],
            'subject' => $row['subject'],
            'sender' => $row['sender'],
            'time' => date('M d, Y', strtotime($row['date_requested_raw'])), // Format the date here
        ];
    }
}

$stmt->close();
$conn->close();

echo json_encode($requests);
?>