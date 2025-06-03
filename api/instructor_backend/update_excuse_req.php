<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

include __DIR__ . '/../../src/conn.php'; 

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed", "details" => $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['excused_request_id'], $data['status'])) {
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    $excuse_req_id = $data['excused_request_id'];
    $status = $data['status']; // Expected values: 'Approved', 'Denied', 'Pending'

    // Start a transaction to ensure atomicity
    $conn->begin_transaction();

    try {
        // Step 1: Update the status of the excused_request
        $stmt_update_excused = $conn->prepare("UPDATE excused_request SET status=? WHERE excused_request_id=?");
        if (!$stmt_update_excused) {
            throw new Exception("Failed to prepare excused_request update statement: " . $conn->error);
        }
        $stmt_update_excused->bind_param("si", $status, $excuse_req_id);
        if (!$stmt_update_excused->execute()) {
            throw new Exception("Excused request update failed: " . $stmt_update_excused->error);
        }
        $stmt_update_excused->close();

        // Step 2: If the status is 'Approved', manage the corresponding attendance record
        if ($status === 'Approved') {
            // Fetch student_details_id and date_of_absence from the excused_request
            $stmt_fetch_details = $conn->prepare("SELECT student_details_id, date_of_absence FROM excused_request WHERE excused_request_id = ?");
            if (!$stmt_fetch_details) {
                throw new Exception("Failed to prepare fetch excused request details statement: " . $conn->error);
            }
            $stmt_fetch_details->bind_param("i", $excuse_req_id);
            if (!$stmt_fetch_details->execute()) {
                throw new Exception("Failed to fetch excused request details: " . $stmt_fetch_details->error);
            }
            $result_details = $stmt_fetch_details->get_result();
            if ($result_details->num_rows === 0) {
                throw new Exception("Excused request not found for ID: " . $excuse_req_id);
            }
            $request_details = $result_details->fetch_assoc();
            $student_details_id = $request_details['student_details_id'];
            $date_of_absence = $request_details['date_of_absence'];
            $stmt_fetch_details->close();

            // Check if an attendance record already exists for this student on this date
            $stmt_check_attendance = $conn->prepare("SELECT COUNT(*) FROM attendance WHERE student_details_id = ? AND date = ?");
            if (!$stmt_check_attendance) {
                throw new Exception("Failed to prepare check attendance statement: " . $conn->error);
            }
            $stmt_check_attendance->bind_param("is", $student_details_id, $date_of_absence);
            if (!$stmt_check_attendance->execute()) {
                throw new Exception("Failed to check for existing attendance record: " . $stmt_check_attendance->error);
            }
            $count = 0;
            $stmt_check_attendance->bind_result($count);
            $stmt_check_attendance->fetch();
            $stmt_check_attendance->close();

            if ($count > 0) {
                // If record exists, update its status to 'excused'
                $stmt_update_attendance = $conn->prepare("UPDATE attendance SET status = 'excused' WHERE student_details_id = ? AND date = ?");
                if (!$stmt_update_attendance) {
                    throw new Exception("Failed to prepare attendance update statement: " . $conn->error);
                }
                $stmt_update_attendance->bind_param("is", $student_details_id, $date_of_absence);
                if (!$stmt_update_attendance->execute()) {
                    throw new Exception("Failed to update attendance record: " . $stmt_update_attendance->error);
                }
                $stmt_update_attendance->close();
            } else {
                // If no record exists, insert a new one with status 'excused'
                // is_locked is set to 0 (unlocked) by default for new entries
                $stmt_insert_attendance = $conn->prepare("INSERT INTO attendance (student_details_id, date, status, is_locked) VALUES (?, ?, 'excused', 0)");
                if (!$stmt_insert_attendance) {
                    throw new Exception("Failed to prepare attendance insert statement: " . $conn->error);
                }
                $stmt_insert_attendance->bind_param("is", $student_details_id, $date_of_absence);
                if (!$stmt_insert_attendance->execute()) {
                    throw new Exception("Failed to insert new attendance record: " . $stmt_insert_attendance->error);
                }
                $stmt_insert_attendance->close();
            }
        }

        // Commit the transaction if all operations were successful
        $conn->commit();
        echo json_encode(["success" => true, "message" => "Request " . $status . " and attendance record managed successfully."]);

    } catch (Exception $e) {
        // Rollback the transaction on any error
        $conn->rollback();
        error_log("Error in approve_excused_request.php: " . $e->getMessage());
        echo json_encode(["success" => false, "error" => "Operation failed: " . $e->getMessage()]);
    } finally {
        // Close the database connection
        if ($conn) {
            $conn->close();
        }
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}
?>