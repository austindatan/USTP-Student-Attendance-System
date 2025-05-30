<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once("../src/conn.php");

if ($conn->connect_error) {
echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
exit;
}

$student_id = $_GET['student_id'] ?? null;

if (!$student_id) {
http_response_code(400);
echo json_encode(["message" => "Student ID is required."]);
$conn->close();
exit();
}

// Fetch main student details
$query_student = "
SELECT 
	student_id, email, firstname, middlename, lastname, date_of_birth,
	contact_number, street, city, province, zipcode, country, image
FROM student
WHERE student_id = ?
";
$stmt_student = $conn->prepare($query_student);
if ($stmt_student === false) {
http_response_code(500);
echo json_encode(["message" => "Failed to prepare student query: " . $conn->error]);
$conn->close();
exit();
}
$stmt_student->bind_param("i", $student_id);
$stmt_student->execute();
$result_student = $stmt_student->get_result();

if ($result_student->num_rows === 0) {
http_response_code(404);
echo json_encode(["message" => "Student not found."]);
$stmt_student->close();
$conn->close();
exit();
}

$student = $result_student->fetch_assoc();
$stmt_student->close();

// Fetch all associated student_details and section_courses for this student
$query_enrollments = "
SELECT 
	sd.student_details_id,
	sd.section_course_id,
	sd.program_details_id,
	sec.year_level_id,
	sec.semester_id,
	sec.section_name,
	inst.firstname AS instructor_firstname,
	inst.lastname AS instructor_lastname,
	p.program_name,
	sc.instructor_id,
	sc.schedule_day,
	sc.start_time,
	sc.end_time,
	sc.image AS section_course_image,
	sc.hexcode,
	c.course_code,
	c.course_name,
	c.description AS course_description
FROM 
	student_details sd
LEFT JOIN /* Use LEFT JOIN to include students who might not have a section_course_id yet */
	section_courses sc ON sd.section_course_id = sc.section_course_id
LEFT JOIN 
	section sec ON sc.section_id = sec.section_id
LEFT JOIN 
	course c ON sc.course_id = c.course_id
JOIN 
	instructor inst ON sc.instructor_id = inst.instructor_id
JOIN 
	program_details pd ON sd.program_details_id = pd.program_details_id
JOIN
	program p ON pd.program_id = p.program_id
WHERE 
	sd.student_id = ?
";
$stmt_enrollments = $conn->prepare($query_enrollments);
if ($stmt_enrollments === false) {
http_response_code(500);
echo json_encode(["message" => "Failed to prepare enrollments query: " . $conn->error]);
$conn->close();
exit();
}
$stmt_enrollments->bind_param("i", $student_id);
$stmt_enrollments->execute();
$result_enrollments = $stmt_enrollments->get_result();

$enrollments = [];
while ($row = $result_enrollments->fetch_assoc()) {
	$enrollments[] = $row;
}
$stmt_enrollments->close();

// Combine main student data with enrollments
$student['enrollments'] = $enrollments;

echo json_encode($student);

$conn->close();
?>