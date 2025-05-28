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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $studentFields = [
        'firstname', 'middlename', 'lastname', 'date_of_birth',
        'contact_number', 'email', 'password', 'street',
        'city', 'province', 'zipcode', 'country'
    ];

    foreach ($studentFields as $field) {
        $$field = isset($_POST[$field]) ? $conn->real_escape_string($_POST[$field]) : '';
    }

    $instructor_id = isset($_POST['instructor_id']) ? $conn->real_escape_string($_POST['instructor_id']) : '';
    $section_id = isset($_POST['section_id']) ? $conn->real_escape_string($_POST['section_id']) : '';
    $program_details_id = isset($_POST['program_details_id']) ? $conn->real_escape_string($_POST['program_details_id']) : '';

    if (empty($instructor_id) || empty($section_id) || empty($program_details_id)) {
        http_response_code(400);
        echo json_encode([
            "message" => "Missing instructor/section/program ID",
        ]);
        exit();
    }

    // 🔍 Check for existing student with matching core identity
    $checkExisting = $conn->prepare("
        SELECT s.student_id 
        FROM student s 
        JOIN student_details sd ON s.student_id = sd.student_id
        WHERE s.firstname = ? AND s.middlename = ? AND s.lastname = ? 
        AND s.date_of_birth = ?
        AND sd.instructor_id = ? AND sd.section_id = ? AND sd.program_details_id = ?
    ");
    $checkExisting->bind_param("ssssiii", $firstname, $middlename, $lastname, $date_of_birth, $instructor_id, $section_id, $program_details_id);
    $checkExisting->execute();
    $existingResult = $checkExisting->get_result();

    if ($existingResult->num_rows > 0) {
        echo json_encode(["message" => "This student already exists in this section."]);
        exit(); // 🚫 STOP: No insert
    }

    // ✅ Handle image upload
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

    // ✅ Insert into student
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

        $insertStmt = $conn->prepare("INSERT INTO student_details (student_id, instructor_id, section_id, program_details_id) VALUES (?, ?, ?, ?)");
        $insertStmt->bind_param("iiii", $student_id, $instructor_id, $section_id, $program_details_id);
        if ($insertStmt->execute()) {
            echo json_encode(["message" => "Student and details added successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Student added, but failed to insert details", "error" => $insertStmt->error]);
        }
        $insertStmt->close();
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to add student", "error" => $conn->error]);
    }

    $checkExisting->close();

} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>
