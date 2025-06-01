<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php';


if ($conn->connect_error) {
    http_response_code(500); 
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$instructor_id = isset($_GET['instructor_id']) ? intval($_GET['instructor_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : null;

if (!$instructor_id || !$date) {
    http_response_code(400); 
    echo json_encode([
        "error" => "Missing instructor_id or date"
    ]);
    exit;
}

$students_result = 0;

$stmt1 = $conn->prepare("
    SELECT COUNT(DISTINCT sd.student_id) AS total_students 
    FROM student_details sd
    JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
    WHERE sc.instructor_id = ?
");
if ($stmt1 === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare statement 1: " . $conn->error]);
    $conn->close();
    exit;
}
$stmt1->bind_param("i", $instructor_id);
if (!$stmt1->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to execute statement 1: " . $stmt1->error]);
    $stmt1->close();
    $conn->close();
    exit;
}
$res1 = $stmt1->get_result();
if ($row1 = $res1->fetch_assoc()) {
    $students_result = intval($row1['total_students']);
}
$stmt1->close();

$present_result = 0;

$stmt2 = $conn->prepare("
    SELECT COUNT(DISTINCT a.student_details_id) AS present_today
    FROM attendance a
    JOIN student_details sd ON a.student_details_id = sd.student_details_id
    JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
    WHERE a.status = 'Present'
    AND a.date = ?
    AND sc.instructor_id = ?
");
if ($stmt2 === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare statement 2: " . $conn->error]);
    $conn->close();
    exit;
}
$stmt2->bind_param("si", $date, $instructor_id);
if (!$stmt2->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to execute statement 2: " . $stmt2->error]);
    $stmt2->close();
    $conn->close();
    exit;
}
$res2 = $stmt2->get_result();
if ($row2 = $res2->fetch_assoc()) {
    $present_result = intval($row2['present_today']);
}
$stmt2->close();

$classes_result = 0;

$stmt3 = $conn->prepare("
    SELECT COUNT(DISTINCT section_course_id) AS total_classes 
    FROM section_courses 
    WHERE instructor_id = ?
");
if ($stmt3 === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare statement 3: " . $conn->error]);
    $conn->close();
    exit;
}
$stmt3->bind_param("i", $instructor_id);
if (!$stmt3->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to execute statement 3: " . $stmt3->error]);
    $stmt3->close();
    $conn->close();
    exit;
}
$res3 = $stmt3->get_result();
if ($row3 = $res3->fetch_assoc()) {
    $classes_result = intval($row3['total_classes']);
}
$stmt3->close();

$excuse_requests_result = 0; 

$stmt4 = $conn->prepare("SELECT COUNT(*) AS pending_excuse_requests FROM excused_request WHERE status = 'pending'");
if ($stmt4 === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare statement 4: " . $conn->error]);
    $conn->close();
    exit;
}
if (!$stmt4->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to execute statement 4: " . $stmt4->error]);
    $stmt4->close();
    $conn->close();
    exit;
}
$res4 = $stmt4->get_result();
if ($row4 = $res4->fetch_assoc()) {
    $excuse_requests_result = intval($row4['pending_excuse_requests']);
}
$stmt4->close();


http_response_code(200); 
echo json_encode([
    "totalStudents" => $students_result,
    "studentsPresentToday" => $present_result,
    "totalClasses" => $classes_result,
    "excuseRequests" => $excuse_requests_result
]);

$conn->close();
?>