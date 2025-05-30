<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php'; 

// Check for database connection error at the beginning
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$instructor_id = isset($_GET['instructor_id']) ? intval($_GET['instructor_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : null;

if (!$instructor_id || !$date) {
    http_response_code(400); // Bad Request
    echo json_encode([
        "error" => "Missing instructor_id or date"
    ]);
    exit;
}

$students_result = 0;
// Corrected Query 1: Get total unique students associated with this instructor's sections
// Students are linked to sections via student_details, and sections are linked to instructors via section_courses.
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
// Corrected Query 2: Get students present today for this instructor's sections
// Attendance records are for student_details_id, which links to section_courses for instructor_id.
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
// Corrected Query 3: Get total classes (sections/courses) assigned to this instructor
// This information is directly available in the 'section_courses' table.
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

$events_result = 0;
// Query 4: Upcoming events (attendance records with future dates) - this query seems correct
// as it doesn't filter by instructor and is a general count.
$events_query = "SELECT COUNT(*) AS upcoming_events FROM attendance WHERE date > CURDATE()";
$res4 = $conn->query($events_query);
if ($res4 === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to execute events query: " . $conn->error]);
    $conn->close();
    exit;
}
if ($row4 = $res4->fetch_assoc()) {
    $events_result = intval($row4['upcoming_events']);
}

// Set HTTP status code to 200 OK for successful response
http_response_code(200); 
echo json_encode([
    "totalStudents" => $students_result,
    "studentsPresentToday" => $present_result,
    "totalClasses" => $classes_result,
    "upcomingEvents" => $events_result
]);

$conn->close();
?>