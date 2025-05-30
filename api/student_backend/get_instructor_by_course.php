<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

include __DIR__ . '/../../src/conn.php';

$studentDetailsId = $_GET['student_details_id'] ?? null;
$courseId = $_GET['course_id'] ?? null;

if ($studentDetailsId && $courseId) {
    $sql = "SELECT i.instructor_id, i.firstname, i.lastname, i.email
            FROM student_details sd
            JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
            JOIN course c ON sc.course_id = c.course_id
            JOIN instructor i ON sc.instructor_id = i.instructor_id
            WHERE sd.student_details_id = ? AND c.course_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $studentDetailsId, $courseId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode([
            "success" => true,
            "instructor" => $row
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No instructor found for this course"
        ]);
    }

    $stmt->close();
} else {
    echo json_encode([
        "success" => false,
        "message" => "Missing parameters"
    ]);
}

$conn->close();
