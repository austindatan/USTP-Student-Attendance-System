<?php

// ERM HINDI ITO NAGAMIT

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include 'conn.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        // Sanitize and hash password
        $email = $data['email'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $firstname = $data['firstname'];
        $middlename = $data['middlename'];
        $lastname = $data['lastname'];
        $dob = $data['date_of_birth'];
        $contact = $data['contact_number'];
        $street = $data['street'];
        $city = $data['city'];
        $province = $data['province'];
        $zipcode = $data['zipcode'];
        $country = $data['country'];
        $image = $data['image']; // base64 or file path

        $stmt = $conn->prepare("INSERT INTO `student` (`email`, `password`, `firstname`, `middlename`, `lastname`, `date_of_birth`, `contact_number`, `street`, `city`, `province`, `zipcode`, `country`, `image`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssssssss", $email, $password, $firstname, $middlename, $lastname, $dob, $contact, $street, $city, $province, $zipcode, $country, $image);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Student registered successfully"]);
        } else {
            echo json_encode(["error" => "Failed to register student", "details" => $stmt->error]);
        }

        $stmt->close();
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        
        $student_id = $data['student_id'];  // Required to know who to update
        
        // Optional fields to update
        $email = $data['email'];
        $firstname = $data['firstname'];
        $middlename = $data['middlename'];
        $lastname = $data['lastname'];
        $dob = $data['date_of_birth'];
        $contact = $data['contact_number'];
        $street = $data['street'];
        $city = $data['city'];
        $province = $data['province'];
        $zipcode = $data['zipcode'];
        $country = $data['country'];
        $image = $data['image'];
        
        $stmt = $conn->prepare("UPDATE `student` SET `email`=?, `firstname`=?, `middlename`=?, `lastname`=?, `date_of_birth`=?, `contact_number`=?, `street`=?, `city`=?, `province`=?, `zipcode`=?, `country`=?, `image`=? WHERE `student_id`=?");
        $stmt->bind_param("ssssssssssssi", $email, $firstname, $middlename, $lastname, $dob, $contact, $street, $city, $province, $zipcode, $country, $image, $student_id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Student updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update student", "details" => $stmt->error]);
        }
    
        $stmt->close();
        break;

    case 'GET':
        $stmt = "SELECT * FROM `student`";
        $result = $conn->query($stmt);

        $student = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $student[] = $row;
            }
        }
        echo json_encode($student);
        break;

    case 'DELETE':
        // Get raw input (usually JSON)
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Make sure student_id is provided
        if (isset($data['student_id'])) {
            $student_id = $data['student_id'];

            $stmt = $conn->prepare("DELETE FROM `students` WHERE `student_id` = ?");
            $stmt->bind_param("i", $student_id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Student deleted successfully"]);
            } else {
                echo json_encode(["error" => "Failed to delete student", "details" => $stmt->error]);
            }

            $stmt->close();
        } else {
            echo json_encode(["error" => "Missing student_id"]);
        }

        break;

    default:
        echo json_encode(["error" => "Invalid request"]);
        break;
}













?>