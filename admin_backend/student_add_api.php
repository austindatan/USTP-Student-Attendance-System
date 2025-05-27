<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Fields for student table
    $studentFields = [
        'firstname', 'middlename', 'lastname', 'date_of_birth',
        'contact_number', 'email', 'password', 'street',
        'city', 'province', 'zipcode', 'country'
    ];

    foreach ($studentFields as $field) {
        $$field = isset($_POST[$field]) ? $conn->real_escape_string($_POST[$field]) : '';
    }

    // Fields for student_details table
    $instructor_id = isset($_POST['instructor_id']) ? $conn->real_escape_string($_POST['instructor_id']) : '';
    $section_id = isset($_POST['section_id']) ? $conn->real_escape_string($_POST['section_id']) : '';
    $program_details_id = isset($_POST['program_details_id']) ? $conn->real_escape_string($_POST['program_details_id']) : '';

    // Validate foreign keys
    if (empty($instructor_id) || empty($section_id) || empty($program_details_id)) {
        http_response_code(400);
        echo json_encode([
            "message" => "Missing instructor/section/program ID",
            "debug" => [
                "instructor_id" => $instructor_id,
                "section_id" => $section_id,
                "program_details_id" => $program_details_id
            ]
        ]);
        exit();
    }

    // Handle image upload
    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = uniqid() . "_" . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $imagePath = 'uploads/' . $filename;
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to upload image."]);
            exit();
        }
    }

    // Insert into `student` table
    $sql = "INSERT INTO student (
                email, password, firstname, middlename, lastname,
                date_of_birth, contact_number, street, city, province,
                zipcode, country, image
            ) VALUES (
                '$email', '$password', '$firstname', '$middlename', '$lastname',
                '$date_of_birth', '$contact_number', '$street', '$city', '$province',
                '$zipcode', '$country', '$imagePath'
            )";

    if ($conn->query($sql) === TRUE) {
        $student_id = $conn->insert_id;

        // Insert into `student_details` table
        $detailsSql = "INSERT INTO student_details (
            student_id, instructor_id, section_id, program_details_id
        ) VALUES (
            '$student_id', '$instructor_id', '$section_id', '$program_details_id'
        )";

        if ($conn->query($detailsSql) === TRUE) {
            echo json_encode(["message" => "Student added successfully"]);
        } else {
            http_response_code(500);
            echo json_encode([
                "message" => "Student added but failed to insert details",
                "error" => $conn->error
            ]);
        }

    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to add student", "error" => $conn->error]);
    }

} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>
