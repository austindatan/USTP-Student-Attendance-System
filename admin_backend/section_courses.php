<?php
// section_courses.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

include __DIR__ . '/../src/conn.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Get section_id from GET request
$sectionId = isset($_GET['section_id']) ? intval($_GET['section_id']) : 0;

if ($sectionId === 0) {
    die(json_encode(["success" => false, "message" => "Section ID is required."]));
}

// SQL query to fetch section details and its courses, including instructor details
$sql = "SELECT
            s.section_id,
            s.section_name,
            yl.year_level_name,
            sem.semester_name,
            sc.section_course_id,
            c.course_id,
            c.course_name,
            sc.schedule_day,
            sc.start_time,
            sc.end_time,
            i.firstname AS instructor_firstname,  -- Select instructor's first name
            i.lastname AS instructor_lastname    -- Select instructor's last name
        FROM
            section_courses sc
        JOIN
            section s ON sc.section_id = s.section_id
        JOIN
            course c ON sc.course_id = c.course_id
        LEFT JOIN
            year_level yl ON s.year_level_id = yl.year_id
        LEFT JOIN
            semester sem ON s.semester_id = sem.semester_id
        LEFT JOIN
            instructor i ON sc.instructor_id = i.instructor_id -- Join with instructor table
        WHERE
            sc.section_id = ?
        ORDER BY
            c.course_name";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $sectionId);
$stmt->execute();
$result = $stmt->get_result();

$sectionDetails = null;
$courses = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if ($sectionDetails === null) {
            // Populate section details once
            $sectionDetails = [
                "section_id" => $row["section_id"],
                "section_name" => $row["section_name"],
                "year_level_name" => $row["year_level_name"],
                "semester_name" => $row["semester_name"]
            ];
        }
        // Add course details, including instructor names
        $courses[] = [
            "section_course_id" => $row["section_course_id"],
            "course_id" => $row["course_id"],
            "course_name" => $row["course_name"],
            "schedule_day" => $row["schedule_day"],
            "start_time" => $row["start_time"],
            "end_time" => $row["end_time"],
            "instructor_firstname" => $row["instructor_firstname"], // Add to course array
            "instructor_lastname" => $row["instructor_lastname"]   // Add to course array
        ];
    }
    echo json_encode(["success" => true, "section" => $sectionDetails, "courses" => $courses]);
} else {
    // Fetch section details even if no courses are found for it
    $sql_section_only = "SELECT
                            s.section_id,
                            s.section_name,
                            yl.year_level_name,
                            sem.semester_name
                        FROM
                            section s
                        LEFT JOIN
                            year_level yl ON s.year_level_id = yl.year_id
                        LEFT JOIN
                            semester sem ON s.semester_id = sem.semester_id
                        WHERE
                            s.section_id = ?";
    $stmt_section_only = $conn->prepare($sql_section_only);
    $stmt_section_only->bind_param("i", $sectionId);
    $stmt_section_only->execute();
    $result_section_only = $stmt_section_only->get_result();

    if ($result_section_only->num_rows > 0) {
        $sectionDetails = $result_section_only->fetch_assoc();
        echo json_encode(["success" => true, "section" => $sectionDetails, "courses" => [], "message" => "No courses found for this section."]);
    } else {
        echo json_encode(["success" => false, "message" => "Section not found."]);
    }
}

// Close statements if they were successfully prepared and executed
if (isset($stmt) && $stmt instanceof mysqli_stmt) {
    $stmt->close();
}
if (isset($stmt_section_only) && $stmt_section_only instanceof mysqli_stmt) {
    $stmt_section_only->close();
}
$conn->close();
?>