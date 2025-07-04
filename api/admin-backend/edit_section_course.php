<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $sectionCourseId = isset($data['section_course_id']) ? intval($data['section_course_id']) : 0;
    $courseId = isset($data['course_id']) ? intval($data['course_id']) : 0;
    $scheduleDay = isset($data['schedule_day']) ? trim($data['schedule_day']) : '';
    $startTime = isset($data['start_time']) ? trim($data['start_time']) : '';
    $endTime = isset($data['end_time']) ? trim($data['end_time']) : '';
    $instructorId = isset($data['instructor_id']) ? intval($data['instructor_id']) : null; 

    if ($sectionCourseId === 0 || $courseId === 0 || empty($scheduleDay) || empty($startTime) || empty($endTime)) {
        die(json_encode(["success" => false, "message" => "Missing required fields."]));
    }

    $sql = "UPDATE section_courses
            SET
                course_id = ?,
                schedule_day = ?,
                start_time = ?,
                end_time = ?,
                instructor_id = ? 
            WHERE
                section_course_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssii", $courseId, $scheduleDay, $startTime, $endTime, $instructorId, $sectionCourseId);

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
                sc.end_time,
                sc.instructor_id,             
                i.firstname AS instructor_firstname, 
                i.lastname AS instructor_lastname   
            FROM
                section_courses sc
            JOIN
                course c ON sc.course_id = c.course_id
            LEFT JOIN
                instructor i ON sc.instructor_id = i.instructor_id 
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