<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

// Check for database connection error at the beginning
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$instructor_id = isset($_GET['instructor_id']) ? intval($_GET['instructor_id']) : 0;

if (!$instructor_id) {
    http_response_code(400); // Bad Request
    echo json_encode([
        "error" => "Missing instructor_id"
    ]);
    exit;
}

$days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Included all days for completeness
$response = [];

foreach ($days as $day) {
    $query = "
        SELECT COUNT(DISTINCT a.student_details_id) as Students
        FROM attendance a
        JOIN student_details sd ON sd.student_details_id = a.student_details_id
        JOIN SectionCourses sc ON sd.section_course_id = sc.section_course_id -- Added join to link instructor
        WHERE a.status = 'Present'
        AND sc.instructor_id = ? -- Corrected to use instructor_id from SectionCourses
        AND DAYNAME(a.date) = ?
    ";
    
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        // Log the error and send a generic message
        error_log("Failed to prepare statement for day {$day}: " . $conn->error);
        // Continue processing other days or exit if critical
        continue; // Or exit; to stop on first error
    }
    
    $stmt->bind_param("is", $instructor_id, $day);
    if (!$stmt->execute()) {
        error_log("Failed to execute statement for day {$day}: " . $stmt->error);
        $stmt->close();
        continue; // Or exit;
    }
    
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $response[] = [
        'name' => substr($day, 0, 3), // e.g., "Mon", "Tue"
        'Students' => (int)$result['Students']
    ];
}

// Set HTTP status code to 200 OK for successful response
http_response_code(200);
echo json_encode($response);
$conn->close();
?>