<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_GET['instructor_id'])) {
        $instructor_id = $_GET['instructor_id'];

        if (!preg_match('/^[a-zA-Z0-9\-]+$/', $instructor_id)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid instructor_id format"]);
            exit();
        }

        $stmt = $conn->prepare("SELECT * FROM instructor WHERE instructor_id = ?");
        $stmt->bind_param("s", $instructor_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $instructor = $result->fetch_assoc();
            echo json_encode($instructor);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Instructor not found"]);
        }

    } else {
        $sql = "SELECT * FROM instructor";
        $result = $conn->query($sql);

        $instructors = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $instructors[] = $row;
            }
        }

        echo json_encode($instructors);
    }

} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>
