<?php
// edit_section_course.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost";
$username = "root"; // Replace with your database username
$password = "";     // Replace with your database password
$dbname = "attendance_monitoring";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $data = json_decode(file_get_contents("php://input"), true);

    $sectionCourseId = isset($data['section_course_id']) ? intval($data['section_course_id']) : 0;
    $courseId = isset($data['course_id']) ? intval($data['course_id']) : 0;
    $scheduleDay = isset($data['schedule_day']) ? trim($data['schedule_day']) : '';
    $startTime = isset($data['start_time']) ? trim($data['start_time']) : '';
    $endTime = isset($data['end_time']) ? trim($data['end_time']) : '';

    if ($sectionCourseId === 0 || $courseId === 0 || empty($scheduleDay) || empty($startTime) || empty($endTime)) {
        die(json_encode(["success" => false, "message" => "Missing required fields."]));
    }

    // SQL query to update section_courses
    $sql = "UPDATE section_courses
            SET
                course_id = ?,
                schedule_day = ?,
                start_time = ?,
                end_time = ?
            WHERE
                section_course_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssi", $courseId, $scheduleDay, $startTime, $endTime, $sectionCourseId);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Section course updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "No changes made or section course not found."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Error updating section course: " . $stmt->error]);
    }

    $stmt->close();
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request to fetch a single section course for editing
    $sectionCourseId = isset($_GET['section_course_id']) ? intval($_GET['section_course_id']) : 0;

    if ($sectionCourseId === 0) {
        die(json_encode(["success" => false, "message" => "Section Course ID is required."]));
    }

    $sql = "SELECT
                sc.section_course_id,
                sc.section_id,
                sc.course_id,
                c.course_name,
                sc.schedule_day,
                sc.start_time,
                sc.end_time
            FROM
                section_courses sc
            JOIN
                course c ON sc.course_id = c.course_id
            WHERE
                sc.section_course_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $sectionCourseId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $sectionCourse = $result->fetch_assoc();
        echo json_encode(["success" => true, "sectionCourse" => $sectionCourse]);
    } else {
        echo json_encode(["success" => false, "message" => "Section course not found."]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

$conn->close();
?>
