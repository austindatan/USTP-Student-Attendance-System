<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Ensure POST is allowed
header("Access-Control-Allow-Headers: Content-Type"); // Add Content-Type to allowed headers

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../src/conn.php'; // Path to your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $conn->begin_transaction(); // Start a transaction for atomicity

    try {
        $studentFields = [
            'firstname', 'middlename', 'lastname', 'date_of_birth',
            'contact_number', 'email', 'password', 'street',
            'city', 'province', 'zipcode', 'country'
        ];

        foreach ($studentFields as $field) {
            $$field = isset($_POST[$field]) ? $conn->real_escape_string($_POST[$field]) : '';
        }

        // Validate required student personal fields
        if (empty($firstname) || empty($lastname) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["message" => "Missing required student personal information (firstname, lastname, email, password)."]);
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
                $imagePath = $filename;
            } else {
                throw new Exception("Failed to upload image."); // Throw exception to trigger rollback
            }
        }

        // Insert into student table
        $sql = "INSERT INTO student (
            email, password, firstname, middlename, lastname,
            date_of_birth, contact_number, street, city, province,
            zipcode, country, image
        ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?
        )";
        $stmt_student = $conn->prepare($sql);
        $stmt_student->bind_param("sssssssssssss",
            $email, $password, $firstname, $middlename, $lastname,
            $date_of_birth, $contact_number, $street, $city, $province,
            $zipcode, $country, $imagePath
        );
        if (!$stmt_student->execute()) {
            throw new Exception("Failed to add student: " . $stmt_student->error);
        }
        $student_id = $conn->insert_id;
        $stmt_student->close();

        // Handle enrollments
        if (!isset($_POST['enrollments'])) {
            throw new Exception("No enrollment data provided.");
        }

        $enrollments_json = $_POST['enrollments'];
        $enrollments = json_decode($enrollments_json, true); // Decode the JSON string into an array

        if (!is_array($enrollments) || empty($enrollments)) {
            throw new Exception("Invalid or empty enrollment data.");
        }

        // Changed 'section_id' to 'section_course_id' in the SQL INSERT statement
        $insert_details_stmt = $conn->prepare("INSERT INTO student_details (student_id, instructor_id, section_course_id, program_details_id) VALUES (?, ?, ?, ?)");

        foreach ($enrollments as $enrollment) {
            $instructor_id = isset($enrollment['instructor_id']) ? $conn->real_escape_string($enrollment['instructor_id']) : '';
            // Changed to read 'section_course_id' from the enrollment array
            $section_course_id = isset($enrollment['section_course_id']) ? $conn->real_escape_string($enrollment['section_course_id']) : '';
            $program_details_id = isset($enrollment['program_details_id']) ? $conn->real_escape_string($enrollment['program_details_id']) : '';

            // Changed validation to use $section_course_id
            if (empty($instructor_id) || empty($section_course_id) || empty($program_details_id)) {
                throw new Exception("Missing instructor/section course/program ID in one of the enrollments.");
            }

            // Bind parameters, ensuring correct order and variable names
            $insert_details_stmt->bind_param("iiii", $student_id, $instructor_id, $section_course_id, $program_details_id);
            if (!$insert_details_stmt->execute()) {
                throw new Exception("Failed to insert student enrollment details: " . $insert_details_stmt->error);
            }
        }
        $insert_details_stmt->close();

        $conn->commit(); // Commit the transaction if all operations are successful
        echo json_encode(["message" => "Student and all enrollments added successfully"]);

    } catch (Exception $e) {
        $conn->rollback(); // Rollback transaction on error
        http_response_code(500);
        echo json_encode(["message" => $e->getMessage()]);
    } finally {
        $conn->close();
    }

} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>