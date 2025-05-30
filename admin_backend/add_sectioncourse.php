<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$response = array();

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $data = json_decode(file_get_contents("php://input"), true);

    $section_id = $data['section_id'] ?? null;
    $course_id = $data['course_id'] ?? null;
    $schedule_day = $data['schedule_day'] ?? null;
    $start_time = $data['start_time'] ?? null;
    $end_time = $data['end_time'] ?? null;
    $instructor_id = $data['instructor_id'] ?? null;

    // Validate inputs
    if (empty($section_id) || empty($course_id) || empty($schedule_day) || empty($start_time) || empty($end_time) || empty($instructor_id)) {
        $response['success'] = false;
        $response['message'] = 'All fields are required.';
    } else {
        // Prepare an INSERT statement
        $stmt = $conn->prepare("INSERT INTO section_courses (section_id, course_id, schedule_day, start_time, end_time, instructor_id) VALUES (?, ?, ?, ?, ?, ?)");
        
        // Check if the prepare statement failed
        if ($stmt === false) {
            $response['success'] = false;
            $response['message'] = 'Failed to prepare statement: ' . $conn->error;
        } else {
            // Bind parameters
            $stmt->bind_param("iisssi", $section_id, $course_id, $schedule_day, $start_time, $end_time, $instructor_id);

            // Execute the statement
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Section course added successfully!';
            } else {
                $response['success'] = false;
                $response['message'] = 'Failed to add section course: ' . $stmt->error;
            }

            // Close statement
            $stmt->close();
        }
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

// Close connection
$conn->close();

// Output JSON response
echo json_encode($response);
?>