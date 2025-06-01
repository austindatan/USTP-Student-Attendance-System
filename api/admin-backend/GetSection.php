<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "
        SELECT
            sec.section_id,
            sec.section_name,
            c.course_name,
            sc.schedule_day,
            sc.start_time,
            sc.end_time
        FROM
            SectionCourses sc
        INNER JOIN
            section sec ON sc.section_id = sec.section_id
        INNER JOIN
            course c ON sc.course_id = c.course_id
        ORDER BY
            sec.section_name, c.course_name, sc.schedule_day
    ";

    $result = $conn->query($query);

    $Sections = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Sections[] = $row;
        }
    }

    echo json_encode(["success" => true, "Sections" => $Sections]);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
}

if ($conn) {
    $conn->close();
}
?>