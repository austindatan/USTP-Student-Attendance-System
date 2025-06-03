<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Function to delete old image
function deleteOldImage($conn, $student_id) {
    $stmt = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
    if ($stmt === false) {
        error_log("Failed to prepare image select statement: " . $conn->error);
        return;
    }
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $oldImage = $row["image"];
        // MODIFIED: Set upload directory to ustp-student-attendance/uploads
        $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads';

        if ($oldImage && file_exists($uploadDir . DIRECTORY_SEPARATOR . $oldImage)) {
            if (!unlink($uploadDir . DIRECTORY_SEPARATOR . $oldImage)) {
                error_log("Failed to delete old image: " . $uploadDir . DIRECTORY_SEPARATOR . $oldImage);
            }
        }
    }
    $stmt->close();
}

// Get student_id from URL parameter
$student_id = $_GET["student_id"] ?? null;

// Basic Validation for student_id
if (empty($student_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing student ID for update."]);
    $conn->close();
    exit;
}

$conn->begin_transaction(); // Start a transaction for atomicity

try {
    // Get main student data from POST
    $email = $_POST["email"] ?? "";
    $password = $_POST["password"] ?? ""; // Password might be empty if not changed
    $firstname = $_POST["firstname"] ?? "";
    $middlename = $_POST["middlename"] ?? "";
    $lastname = $_POST["lastname"] ?? "";
    $date_of_birth = $_POST["date_of_birth"] ?? "";
    $contact_number = $_POST["contact_number"] ?? "";
    $street = $_POST["street"] ?? "";
    $city = $_POST["city"] ?? "";
    $province = $_POST["province"] ?? "";
    $zipcode = $_POST["zipcode"] ?? "";
    $country = $_POST["country"] ?? "";

    // Validate required student personal fields
    if (empty($firstname) || empty($lastname) || empty($email) || empty($date_of_birth) || empty($contact_number)) {
        throw new Exception("Missing required student personal information (firstname, lastname, email, date of birth, contact number).");
    }

    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        deleteOldImage($conn, $student_id); // Delete old image before uploading new one
        // MODIFIED: Set upload directory to ustp-student-attendance/uploads
        $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads';
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = uniqid() . "_" . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . DIRECTORY_SEPARATOR . $filename; // Ensure correct path concatenation

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $imagePath = $filename;
        } else {
            throw new Exception("Failed to upload new image.");
        }
    } else {
        // If no new image is uploaded, retain the existing one
        $stmt = $conn->prepare("SELECT image FROM student WHERE student_id = ?");
        $stmt->bind_param("i", $student_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $imagePath = $row['image'];
        }
        $stmt->close();
    }

    // Update student table
    // Only update password if it's provided (i.e., not empty)
    $sql_update_student = "UPDATE student SET
        email = ?, firstname = ?, middlename = ?, lastname = ?,
        date_of_birth = ?, contact_number = ?, street = ?, city = ?, province = ?,
        zipcode = ?, country = ?, image = ?
        " . (!empty($password) ? ", password = ?" : "") . "
        WHERE student_id = ?";

    $types = "ssssssssssss"; // Base types for the 12 fields
    $params = [
        $email, $firstname, $middlename, $lastname,
        $date_of_birth, $contact_number, $street, $city, $province,
        $zipcode, $country, $imagePath
    ];

    if (!empty($password)) {
        $types .= "s"; // Add type for password
        $params[] = $password; // Add password to params
    }
    $types .= "i"; // Add type for student_id
    $params[] = $student_id; // Add student_id to params

    $stmt_student = $conn->prepare($sql_update_student);
    if ($stmt_student === false) {
        throw new Exception("Failed to prepare student update statement: " . $conn->error);
    }
    $stmt_student->bind_param($types, ...$params);

    if (!$stmt_student->execute()) {
        throw new Exception("Failed to update student: " . $stmt_student->error);
    }
    $stmt_student->close();

    // Handle enrollments synchronization
    $submittedEnrollments = json_decode($_POST['enrollments'] ?? '[]', true);
    if (!is_array($submittedEnrollments)) {
        throw new Exception("Invalid enrollment data format.");
    }

    // Fetch current enrollments for this student from the database
    $currentEnrollments = [];
    $stmt_fetch_enrollments = $conn->prepare("SELECT student_details_id, section_course_id, program_details_id FROM student_details WHERE student_id = ?");
    if ($stmt_fetch_enrollments === false) {
        throw new Exception("Failed to prepare fetch enrollments statement: " . $conn->error);
    }
    $stmt_fetch_enrollments->bind_param("i", $student_id);
    $stmt_fetch_enrollments->execute();
    $result_enrollments = $stmt_fetch_enrollments->get_result();
    while ($row = $result_enrollments->fetch_assoc()) {
        $currentEnrollments[$row['student_details_id']] = $row;
    }
    $stmt_fetch_enrollments->close();

    $enrollmentsToDelete = [];
    $enrollmentsToInsert = [];

    // Identify enrollments to delete and update
    foreach ($currentEnrollments as $dbId => $dbEnrollment) {
        $foundInSubmitted = false;
        foreach ($submittedEnrollments as $subEnrollment) {
            if (isset($subEnrollment['student_details_id']) && $subEnrollment['student_details_id'] == $dbId) {
                $foundInSubmitted = true;
                break;
            }
        }
        if (!$foundInSubmitted) {
            $enrollmentsToDelete[] = $dbId;
        }
    }

    // Identify new enrollments to insert
    foreach ($submittedEnrollments as $subEnrollment) {
        if (!isset($subEnrollment['student_details_id']) || ($subEnrollment['isNew'] ?? false) === true) {
            $enrollmentsToInsert[] = $subEnrollment;
        }
    }

    // Perform deletions
    if (!empty($enrollmentsToDelete)) {
        $placeholders = implode(',', array_fill(0, count($enrollmentsToDelete), '?'));
        $stmt_delete_enrollments = $conn->prepare("DELETE FROM student_details WHERE student_details_id IN ($placeholders)");
        if ($stmt_delete_enrollments === false) {
            throw new Exception("Failed to prepare delete enrollments statement: " . $conn->error);
        }
        $types = str_repeat('i', count($enrollmentsToDelete));
        $stmt_delete_enrollments->bind_param($types, ...$enrollmentsToDelete);
        if (!$stmt_delete_enrollments->execute()) {
            throw new Exception("Failed to delete old enrollments: " . $stmt_delete_enrollments->error);
        }
        $stmt_delete_enrollments->close();
    }

    // Perform insertions
    if (!empty($enrollmentsToInsert)) {
        $stmt_insert_enrollment = $conn->prepare("INSERT INTO student_details (student_id, section_course_id, program_details_id) VALUES (?, ?, ?)");
        if ($stmt_insert_enrollment === false) {
            throw new Exception("Failed to prepare insert enrollment statement: " . $conn->error);
        }
        foreach ($enrollmentsToInsert as $enrollment) {
            $section_course_id = $enrollment['section_course_id'] ?? null;
            $program_details_id = $enrollment['program_details_id'] ?? null;

            if (empty($section_course_id) || empty($program_details_id)) {
                throw new Exception("Missing data for new enrollment (section_course_id, or program_details_id). Submitted enrollment: " . json_encode($enrollment));
            }
            $stmt_insert_enrollment->bind_param("iii", $student_id, $section_course_id, $program_details_id);
            if (!$stmt_insert_enrollment->execute()) {
                throw new Exception("Failed to insert new enrollment: " . $stmt_insert_enrollment->error);
            }
        }
        $stmt_insert_enrollment->close();
    }

    $conn->commit(); // Commit the transaction if all operations are successful
    echo json_encode(["success" => true, "message" => "Student and enrollments updated successfully."]);

} catch (Exception $e) {
    $conn->rollback(); // Rollback transaction on error
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>