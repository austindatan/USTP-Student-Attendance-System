<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include __DIR__ . '/../../src/conn.php'; 

if (isset($_GET['section_id'])) {
    $section_id = $_GET['section_id'];

    $sql = "SELECT
                sc.section_id,
                s.section_name,
                sc.schedule_day,
                sc.start_time,
                sc.end_time,
                sc.image,
                sc.hexcode,
                c.course_name,
                c.course_code
            FROM section_courses sc
            INNER JOIN section s ON sc.section_id = s.section_id
            INNER JOIN course c ON sc.course_id = c.course_id
            WHERE s.section_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $section_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $sectionInfo = null;
    $courses = [];

    while ($row = $result->fetch_assoc()) {
        if ($sectionInfo === null) {
            $sectionInfo = [
                'section_id' => $row['section_id'],
                'section_name' => $row['section_name'],
                'schedule_day' => $row['schedule_day'],
                'start_time' => $row['start_time'],
                'end_time' => $row['end_time'],
                'image' => $row['image'],
                'hexcode' => $row['hexcode'],
                'courses' => [] 
            ];
        }
        $courses[] = [
            'course_name' => $row['course_name'],
            'course_code' => $row['course_code']
        ];
    }

    if ($sectionInfo === null) {
        echo json_encode(["success" => false, "message" => "Section not found or no courses associated."]);
    } else {
        $sectionInfo['courses'] = $courses;
        echo json_encode($sectionInfo);
    }
} else {
    echo json_encode(["success" => false, "message" => "Section ID not provided."]);
}
?>