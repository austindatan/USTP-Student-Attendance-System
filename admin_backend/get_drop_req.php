<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include database connection
include __DIR__ . '/../src/conn.php';

// Check for database connection error
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $view = $_GET['view'] ?? 'active'; // Default to 'active' view

    $sql = "";
    $stmt = null;
    $dropRequests = [];

    if ($view === 'active') {
        // Fetch active/pending requests from drop_request table
        // Use INNER JOINs as these student_details should still exist
        $sql = "
            SELECT
                s.student_id,
                CONCAT(s.firstname, ' ', s.middlename, ' ', s.lastname) AS student_name,
                p.program_name,
                c.course_name,
                CONCAT(i.firstname, ' ', i.middlename, ' ', i.lastname) AS instructor_name,
                dr.drop_request_id,
                dr.reason,
                dr.status
            FROM drop_request dr
            INNER JOIN student_details sd ON sd.student_details_id = dr.student_details_id
            INNER JOIN student s ON s.student_id = sd.student_id
            INNER JOIN program_details pd ON pd.program_details_id = sd.program_details_id
            INNER JOIN program p ON p.program_id = pd.program_id
            INNER JOIN section_courses sc ON sc.section_course_id = sd.section_course_id
            INNER JOIN course c ON c.course_id = sc.course_id
            INNER JOIN instructor i ON i.instructor_id = sc.instructor_id
            WHERE dr.status != 'Dropped' AND dr.status != 'Archived' -- Filter for active/pending requests
        ";
        $stmt = $conn->prepare($sql);

    } elseif ($view === 'history') {
        // Fetch history from the new drop_history table
        $sql = "
            SELECT
                history_id AS drop_request_id, -- Alias to match frontend's expected ID field
                student_name,
                program_name,
                course_name,
                instructor_name,
                reason,
                status,
                dropped_at
            FROM drop_history
            ORDER BY dropped_at DESC
        ";
        $stmt = $conn->prepare($sql);

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid view parameter. Must be "active" or "history".']);
        $conn->close();
        exit;
    }

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
        $conn->close();
        exit;
    }

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to execute statement: ' . $stmt->error]);
        $stmt->close();
        $conn->close();
        exit;
    }

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $dropRequests[] = $row;
        }
    }

    $stmt->close();
    $conn->close();

    echo json_encode($dropRequests);

} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method. Only GET is allowed for this endpoint.']);
}
?>