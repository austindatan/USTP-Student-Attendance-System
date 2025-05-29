<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../src/conn.php'; // Ensure this path is correct relative to get_section_info.php

if (isset($_GET['section_id'])) {
    $section_id = $_GET['section_id'];

    // Modified SQL query to join through the new `section_courses` table
    // and fetch all courses associated with the given section.
    $sql = "SELECT
                s.section_id,
                s.section_name,
                s.schedule_day,
                s.start_time,
                s.end_time,
                s.image,
                s.hexcode,
                c.course_name,
                c.course_code
            FROM section s
            INNER JOIN section_courses sc ON s.section_id = sc.section_id
            INNER JOIN course c ON sc.course_id = c.course_id
            WHERE s.section_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $section_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $sectionInfo = null;
    $courses = [];

    // Loop through all results to gather all courses linked to the section
    while ($row = $result->fetch_assoc()) {
        // Initialize sectionInfo object from the first row fetched
        if ($sectionInfo === null) {
            $sectionInfo = [
                'section_id' => $row['section_id'],
                'section_name' => $row['section_name'],
                'schedule_day' => $row['schedule_day'],
                'start_time' => $row['start_time'],
                'end_time' => $row['end_time'],
                'image' => $row['image'],
                'hexcode' => $row['hexcode'],
                'courses' => [] // Initialize an array to hold all associated courses
            ];
        }
        // Add current course details to the 'courses' array
        $courses[] = [
            'course_name' => $row['course_name'],
            'course_code' => $row['course_code']
        ];
    }

    if ($sectionInfo === null) {
        // If no section is found or no courses are associated with the section
        echo json_encode(["success" => false, "message" => "Section not found or no courses associated."]);
    } else {
        // Assign the collected courses to the sectionInfo object
        $sectionInfo['courses'] = $courses;
        echo json_encode($sectionInfo);
    }
} else {
    echo json_encode(["success" => false, "message" => "Section ID not provided."]);
}
?>