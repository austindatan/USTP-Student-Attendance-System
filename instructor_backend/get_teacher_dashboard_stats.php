<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php'; 

$instructor_id = isset($_GET['instructor_id']) ? intval($_GET['instructor_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : null;

if (!$instructor_id || !$date) {
    echo json_encode([
        "error" => "Missing instructor_id or date"
    ]);
    exit;
}

$students_result = 0;
$stmt1 = $conn->prepare("SELECT COUNT(DISTINCT student_details_id) AS total FROM student_details WHERE instructor_id = ?");
$stmt1->bind_param("i", $instructor_id);
$stmt1->execute();
$res1 = $stmt1->get_result();
if ($row1 = $res1->fetch_assoc()) {
    $students_result = intval($row1['total']);
}
$stmt1->close();

$present_result = 0;
$stmt2 = $conn->prepare("
    SELECT COUNT(*) AS present_today
    FROM attendance
    WHERE status = 'Present'
    AND date = ?
    AND student_details_id IN (
        SELECT student_details_id FROM student_details WHERE instructor_id = ?
    )
");
$stmt2->bind_param("si", $date, $instructor_id);
$stmt2->execute();
$res2 = $stmt2->get_result();
if ($row2 = $res2->fetch_assoc()) {
    $present_result = intval($row2['present_today']);
}
$stmt2->close();

$classes_result = 0;
$stmt3 = $conn->prepare("SELECT COUNT(DISTINCT section_course_id) AS total_classes FROM student_details WHERE instructor_id = ?");
$stmt3->bind_param("i", $instructor_id);
$stmt3->execute();
$res3 = $stmt3->get_result();
if ($row3 = $res3->fetch_assoc()) {
    $classes_result = intval($row3['total_classes']);
}
$stmt3->close();

$events_result = 0;
$events_query = "SELECT COUNT(*) AS upcoming_events FROM attendance WHERE date > CURDATE()";
$res4 = $conn->query($events_query);
if ($row4 = $res4->fetch_assoc()) {
    $events_result = intval($row4['upcoming_events']);
}

echo json_encode([
    "totalStudents" => $students_result,
    "studentsPresentToday" => $present_result,
    "totalClasses" => $classes_result,
    "upcomingEvents" => $events_result
]);

$conn->close();
?>
