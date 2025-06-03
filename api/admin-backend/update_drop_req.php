<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../../src/conn.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    $drop_req_id = $data['drop_request_id'] ?? null;
    $original_request_status = $data['status'] ?? null;

    if (!$drop_req_id || !$original_request_status) {
        echo json_encode(["error" => "Missing drop_request_id or status in request."]);
        exit;
    }

    $conn->begin_transaction();

    try {
        $stmt_fetch_original_req = $conn->prepare("SELECT student_details_id, reason FROM drop_request WHERE drop_request_id = ?");
        if (!$stmt_fetch_original_req) {
            throw new Exception("Failed to prepare statement for fetching original drop request: " . $conn->error);
        }
        $stmt_fetch_original_req->bind_param("i", $drop_req_id);
        $stmt_fetch_original_req->execute();
        $result_original_req = $stmt_fetch_original_req->get_result();
        $original_req_data = $result_original_req->fetch_assoc();
        $stmt_fetch_original_req->close();

        if (!$original_req_data || !isset($original_req_data['student_details_id'])) {
            throw new Exception("Drop request with ID {$drop_req_id} not found or student_details_id missing.");
        }
        $student_details_id_affected = $original_req_data['student_details_id'];
        $reason_for_request = $original_req_data['reason'];

        $stmt_update_original_req = $conn->prepare("UPDATE drop_request SET status = ? WHERE drop_request_id = ?");
        if (!$stmt_update_original_req) {
            throw new Exception("Failed to prepare statement for updating original drop request status: " . $conn->error);
        }
        $stmt_update_original_req->bind_param("si", $original_request_status, $drop_req_id);
        if (!$stmt_update_original_req->execute()) {
            throw new Exception("Failed to update original drop request status: " . $stmt_update_original_req->error);
        }
        $stmt_update_original_req->close();

        $message = ""; 

        if ($original_request_status === 'Dropped') {

            $stmt_fetch_details_snapshot = $conn->prepare("
                SELECT
                    s.student_id,
                    CONCAT(s.firstname, ' ', s.middlename, ' ', s.lastname) AS student_name,
                    p.program_name,
                    c.course_name,
                    CONCAT(i.firstname, ' ', i.middlename, ' ', i.lastname) AS instructor_name
                FROM student_details sd
                INNER JOIN student s ON s.student_id = sd.student_id
                INNER JOIN program_details pd ON pd.program_details_id = sd.program_details_id
                INNER JOIN program p ON p.program_id = pd.program_id
                INNER JOIN section_courses sc ON sc.section_course_id = sd.section_course_id
                INNER JOIN course c ON c.course_id = sc.course_id
                INNER JOIN instructor i ON i.instructor_id = sc.instructor_id
                WHERE sd.student_details_id = ?
            ");
            if (!$stmt_fetch_details_snapshot) {
                throw new Exception("Failed to prepare statement for fetching student details snapshot: " . $conn->error);
            }
            $stmt_fetch_details_snapshot->bind_param("i", $student_details_id_affected);
            $stmt_fetch_details_snapshot->execute();
            $result_details_snapshot = $stmt_fetch_details_snapshot->get_result();
            $details_snapshot_row = $result_details_snapshot->fetch_assoc();
            $stmt_fetch_details_snapshot->close();

            $student_id_at_drop = $details_snapshot_row['student_id'] ?? NULL;
            $student_name_snapshot = $details_snapshot_row['student_name'] ?? 'N/A';
            $program_name_snapshot = $details_snapshot_row['program_name'] ?? 'N/A';
            $course_name_snapshot = $details_snapshot_row['course_name'] ?? 'N/A';
            $instructor_name_snapshot = $details_snapshot_row['instructor_name'] ?? 'N/A';

            // Insert into `drop_history`
            $stmt_insert_history = $conn->prepare("
                INSERT INTO drop_history
                (drop_request_id, reason, status, student_details_id_at_drop, student_id_at_drop, student_name, program_name, course_name, instructor_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            if (!$stmt_insert_history) {
                throw new Exception("Failed to prepare statement for inserting into drop_history: " . $conn->error);
            }
            $history_record_status = 'Dropped'; 
            $stmt_insert_history->bind_param(
                "ississsss",
                $drop_req_id,
                $reason_for_request,
                $history_record_status,
                $student_details_id_affected,
                $student_id_at_drop,
                $student_name_snapshot,
                $program_name_snapshot,
                $course_name_snapshot,
                $instructor_name_snapshot
            );
            
            if (!$stmt_insert_history->execute()) {
                throw new Exception("Failed to insert into drop_history: " . $stmt_insert_history->error);
            }
            $stmt_insert_history->close();

            // Removes the student
            $stmt_delete_student_details = $conn->prepare("DELETE FROM student_details WHERE student_details_id = ?");
            if (!$stmt_delete_student_details) {
                throw new Exception("Failed to prepare statement for deleting student details: " . $conn->error);
            }
            $stmt_delete_student_details->bind_param("i", $student_details_id_affected);
            if (!$stmt_delete_student_details->execute()) {
                throw new Exception("Failed to delete student details: " . $stmt_delete_student_details->error);
            }
            $stmt_delete_student_details->close();

            // Delete the request from the `drop_request` table
            $stmt_delete_drop_request = $conn->prepare("DELETE FROM drop_request WHERE drop_request_id = ?");
            if (!$stmt_delete_drop_request) {
                throw new Exception("Failed to prepare statement for deleting drop request: " . $conn->error);
            }
            $stmt_delete_drop_request->bind_param("i", $drop_req_id);
            if (!$stmt_delete_drop_request->execute()) {
                throw new Exception("Failed to delete drop request: " . $stmt_delete_drop_request->error);
            }
            $stmt_delete_drop_request->close();
            
            $message = "Drop request approved, student dropped, and history saved. Request removed from pending.";

        } elseif ($original_request_status === 'Rejected') {
            $stmt_fetch_details_snapshot = $conn->prepare("
                SELECT
                    s.student_id,
                    CONCAT(s.firstname, ' ', s.middlename, ' ', s.lastname) AS student_name,
                    p.program_name,
                    c.course_name,
                    CONCAT(i.firstname, ' ', i.middlename, ' ', i.lastname) AS instructor_name
                FROM student_details sd
                INNER JOIN student s ON s.student_id = sd.student_id
                INNER JOIN program_details pd ON pd.program_details_id = sd.program_details_id
                INNER JOIN program p ON p.program_id = pd.program_id
                INNER JOIN section_courses sc ON sc.section_course_id = sd.section_course_id
                INNER JOIN course c ON c.course_id = sc.course_id
                INNER JOIN instructor i ON i.instructor_id = sc.instructor_id
                WHERE sd.student_details_id = ?
            ");
            if (!$stmt_fetch_details_snapshot) {
                throw new Exception("Failed to prepare statement for fetching student details snapshot for rejection: " . $conn->error);
            }
            $stmt_fetch_details_snapshot->bind_param("i", $student_details_id_affected);
            $stmt_fetch_details_snapshot->execute();
            $result_details_snapshot = $stmt_fetch_details_snapshot->get_result();
            $details_snapshot_row = $result_details_snapshot->fetch_assoc();
            $stmt_fetch_details_snapshot->close();

            $student_id_at_drop = $details_snapshot_row['student_id'] ?? NULL;
            $student_name_snapshot = $details_snapshot_row['student_name'] ?? 'N/A';
            $program_name_snapshot = $details_snapshot_row['program_name'] ?? 'N/A';
            $course_name_snapshot = $details_snapshot_row['course_name'] ?? 'N/A';
            $instructor_name_snapshot = $details_snapshot_row['instructor_name'] ?? 'N/A';

            $stmt_insert_history = $conn->prepare("
                INSERT INTO drop_history
                (drop_request_id, reason, status, student_details_id_at_drop, student_id_at_drop, student_name, program_name, course_name, instructor_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            if (!$stmt_insert_history) {
                throw new Exception("Failed to prepare statement for inserting rejected request into drop_history: " . $conn->error);
            }
            $history_record_status = 'Rejected'; 
            $stmt_insert_history->bind_param(
                "ississsss",
                $drop_req_id,
                $reason_for_request,
                $history_record_status,
                $student_details_id_affected,
                $student_id_at_drop,
                $student_name_snapshot,
                $program_name_snapshot,
                $course_name_snapshot,
                $instructor_name_snapshot
            );
            
            if (!$stmt_insert_history->execute()) {
                throw new Exception("Failed to insert rejected request into drop_history: " . $stmt_insert_history->error);
            }
            $stmt_insert_history->close();

            // Delete the request from the `drop_request` table
            $stmt_delete_drop_request = $conn->prepare("DELETE FROM drop_request WHERE drop_request_id = ?");
            if (!$stmt_delete_drop_request) {
                throw new Exception("Failed to prepare statement for deleting drop request: " . $conn->error);
            }
            $stmt_delete_drop_request->bind_param("i", $drop_req_id);
            if (!$stmt_delete_drop_request->execute()) {
                throw new Exception("Failed to delete drop request: " . $stmt_delete_drop_request->error);
            }
            $stmt_delete_drop_request->close();

            $message = "Drop request rejected and history saved. Request removed from pending.";
        } else {
            throw new Exception("Invalid status provided for processing.");
        }

        $conn->commit();
        echo json_encode(["message" => $message]);

    } catch (Exception $e) {
        $conn->rollback();
        error_log("Drop request processing error: " . $e->getMessage());
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        $conn->close();
    }
} else {
    echo json_encode(["error" => "Invalid request method. Only PUT requests are allowed."]);
}
?>