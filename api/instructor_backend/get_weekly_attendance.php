<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    http_response_code(500); 
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$instructor_id = isset($_GET['instructor_id']) ? intval($_GET['instructor_id']) : 0;

if (!$instructor_id) {
    http_response_code(400);
    echo json_encode([
        "error" => "Missing instructor_id"
    ]);
    exit;
}

$days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
$response = [];

foreach ($days as $day) {
    $query = "
        SELECT COUNT(DISTINCT a.student_details_id) as students
        FROM attendance a
        JOIN student_details sd ON sd.student_details_id = a.student_details_id
        JOIN section_courses sc ON sd.section_course_id = sc.section_course_id -- Added join to link instructor
        WHERE a.status = 'Present'
        AND sc.instructor_id = ? -- Corrected to use instructor_id from section_courses
        AND DAYNAME(a.date) = ?
    ";
    
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        error_log("Failed to prepare statement for day {$day}: " . $conn->error);
        continue;
    }
    
    $stmt->bind_param("is", $instructor_id, $day);
    if (!$stmt->execute()) {
        error_log("Failed to execute statement for day {$day}: " . $stmt->error);
        $stmt->close();
        continue; 
    }
    
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $response[] = [
        'name' => substr($day, 0, 3), 
        'students' => (int)$result['students']
    ];
}

http_response_code(200);
echo json_encode($response);
$conn->close();
?>