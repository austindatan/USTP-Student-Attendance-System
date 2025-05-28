<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin during development
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(); // Handle preflight OPTIONS request
}

include __DIR__ . '/../src/conn.php'; // Your database connection

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT course_id, course_code, course_name FROM course ORDER BY course_code ASC"; // Assuming your table is 'course'
    $result = $conn->query($sql);

    $courses = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
        echo json_encode(["success" => true, "courses" => $courses]);
    } else {
        // Log the actual SQL error for debugging on the server
        error_log("Error fetching courses: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Failed to fetch courses from database."]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

if ($conn) {
    $conn->close();
}
?>