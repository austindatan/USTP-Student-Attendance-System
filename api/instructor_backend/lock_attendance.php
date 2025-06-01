<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once('../src/conn.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$section_id = isset($data['section_id']) ? (int)$data['section_id'] : 0;
$course_id = isset($data['course_id']) ? (int)$data['course_id'] : 0;
$date = isset($data['date']) ? $data['date'] : null;
$lock_status = isset($data['lock_status']) ? (int)$data['lock_status'] : null;

if (!$section_id || !$course_id || !$date || $lock_status === null) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields (section_id, course_id, date, lock_status).']);
    exit;
}

// 1. Lock/unlock attendance records
$updateLockStatusQuery = "UPDATE attendance a
                          JOIN student_details sd ON a.student_details_id = sd.student_details_id
                          JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
                          SET a.is_locked = ?
                          WHERE sc.section_id = ?
                          AND sc.course_id = ?
                          AND a.date = ?";

$stmt = $conn->prepare($updateLockStatusQuery);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare lock/unlock statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("iiis", $lock_status, $section_id, $course_id, $date);
$stmt->execute();
$stmt->close();

// 2. If locking, insert "Absent" for students with no attendance record for this date
if ($lock_status == 1) {
    // Get all students in this section/course
    $students_sql = "SELECT sd.student_details_id
                     FROM student_details sd
                     JOIN section_courses sc ON sd.section_course_id = sc.section_course_id
                     WHERE sc.section_id = ? AND sc.course_id = ?";
    $students_stmt = $conn->prepare($students_sql);
    $students_stmt->bind_param("ii", $section_id, $course_id);
    $students_stmt->execute();
    $students_result = $students_stmt->get_result();

    $inserted = 0;
    while ($student = $students_result->fetch_assoc()) {
        // Check if attendance already exists for this student/date
        $check_sql = "SELECT 1 FROM attendance WHERE student_details_id = ? AND date = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("is", $student['student_details_id'], $date);
        $check_stmt->execute();
        $check_stmt->store_result();

        if ($check_stmt->num_rows == 0) {
            // Insert as Absent
            $insert_sql = "INSERT INTO attendance (student_details_id, date, status, is_locked) VALUES (?, ?, 'Absent', 1)";
            $insert_stmt = $conn->prepare($insert_sql);
            $insert_stmt->bind_param("is", $student['student_details_id'], $date);
            $insert_stmt->execute();
            $insert_stmt->close();
            $inserted++;
        }
        $check_stmt->close();
    }
    $students_stmt->close();
}

echo json_encode(['success' => true, 'message' => 'Attendance ' . ($lock_status == 1 ? 'locked' : 'unlocked') . ' successfully.']);

$conn->close();
?>