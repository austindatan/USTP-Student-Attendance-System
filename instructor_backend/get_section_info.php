<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php';

if (isset($_GET['section_id'])) {
    $section_id = $_GET['section_id'];

    $sql = "SELECT s.section_name, s.schedule_day, s.start_time, s.end_time, c.course_name, c.course_code, s.image, s.hexcode
            FROM section s
            JOIN course c ON s.course_id = c.course_id
            WHERE s.section_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $section_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $sectionInfo = $result->fetch_assoc();

    echo json_encode($sectionInfo);
} else {
    echo json_encode(null);
}
?>
