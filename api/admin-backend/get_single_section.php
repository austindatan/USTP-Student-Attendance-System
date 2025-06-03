<?php

header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $section_id = $_GET['section_id'] ?? null;

    if (!$section_id) {
        echo json_encode(["success" => false, "message" => "Section ID is missing."]);
        exit;
    }

    $sql = "SELECT
                s.section_id,
                s.section_name,
                s.year_level_id,
                yl.year_level_name,
                s.semester_id,
                sm.semester_name
            FROM
                section s
            LEFT JOIN
                year_level yl ON s.year_level_id = yl.year_id
            LEFT JOIN
                semester sm ON s.semester_id = sm.semester_id
            WHERE
                s.section_id = ?";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        error_log("Failed to prepare statement in get_single_section.php: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Database error: Could not prepare statement."]);
        exit;
    }

    $stmt->bind_param("i", $section_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $section = $result->fetch_assoc();
        echo json_encode(["success" => true, "section" => $section]);
    } else {
        echo json_encode(["success" => false, "message" => "Section not found."]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
}

$conn->close();
?>