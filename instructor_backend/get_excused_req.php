<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../src/conn.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }

    $instructorId = isset($_GET['instructor_id']) ? intval($_GET['instructor_id']) : 0;

    if ($instructorId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid instructor ID provided.']);
        exit;
    }

    $sql = "
        SELECT
            er.excused_request_id,
            sd.student_details_id,
            CONCAT(s.firstname, ' ', s.middlename, ' ', s.lastname) AS student_name,
            c.course_name,
            er.reason,
            er.date_requested,
            er.date_of_absence,
            er.status
        FROM
            excused_request er
        INNER JOIN
            student_details sd ON er.student_details_id = sd.student_details_id
        INNER JOIN
            student s ON sd.student_id = s.student_id
        INNER JOIN
            section_courses sc ON sd.section_course_id = sc.section_course_id
        INNER JOIN
            course c ON c.course_id = sc.course_id
        WHERE
            sc.instructor_id = ?; -- Filter by the logged-in instructor's ID
    ";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['success' => false, 'error' => 'Failed to prepare SQL statement: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $instructorId); 
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result === false) {
        echo json_encode(['success' => false, 'error' => 'SQL query execution failed: ' . $stmt->error]);
        exit;
    }

    $req = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $req[] = $row;
        }
    } else {
        echo json_encode([]);
        exit;
    }

    echo json_encode($req); 

    $stmt->close();
    $conn->close();

} else {
    echo json_encode(["success" => false, "error" => "Invalid request method for GET endpoint"]);
}
?>