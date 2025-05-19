<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "attendance_monitoring";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Remove or comment out this line:
// echo "Database connected successfully!";
?>