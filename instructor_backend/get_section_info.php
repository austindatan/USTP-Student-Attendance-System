<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php'; // Ensure this path is correct relative to get_section_info.php

if (isset($_GET['section_id'])) {
    $section_id = $_GET['section_id'];

    // IMPORTANT: Added s.section_id to the SELECT statement
    $sql = "SELECT s.section_id, s.section_name, s.schedule_day, s.start_time, s.end_time, c.course_name, c.course_code, s.image, s.hexcode
            FROM section s
            JOIN course c ON s.course_id = c.course_id
            WHERE s.section_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $section_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $sectionInfo = $result->fetch_assoc();

    if ($sectionInfo === null) {
        echo json_encode(["success" => false, "message" => "Section not found."]);
    } else {
        echo json_encode($sectionInfo);
    }
} else {
    echo json_encode(["success" => false, "message" => "Section ID not provided."]);
}
?>
