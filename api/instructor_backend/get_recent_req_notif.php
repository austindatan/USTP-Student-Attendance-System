<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include __DIR__ . '/../../src/conn.php'; 

$instructorId = isset($_GET['instructor_id']) ? $_GET['instructor_id'] : null;

if (!$instructorId) {
    echo json_encode(["success" => false, "message" => "Instructor ID is missing."]);
    exit();
}

$sql = "SELECT
            er.excused_request_id AS id,
            er.reason AS subject,
            CONCAT(s.firstname, ' ', s.lastname) AS sender,
            er.date_requested AS time
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
            AND er.date_requested >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) -- New condition: filter for last 5 days
        ORDER BY
            er.date_requested DESC
        LIMIT 5"; // This limit still applies to the most recent 5 within that 5-day window

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log("Failed to prepare statement: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database query preparation failed."]);
    exit();
}

$stmt->bind_param("i", $instructorId);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }
}

$stmt->close();
$conn->close();

echo json_encode($notifications);

?>