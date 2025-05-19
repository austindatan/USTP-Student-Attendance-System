<?php
// header to allow fetch
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Fake drop requests (pretend it comes from a database)
$dropRequests = [
    [
        "id" => 1,
        "student_name" => "Jane Doe",
        "course" => "BSIT 3A",
        "reason" => "Medical issues",
        "status" => "Pending"
    ],
    [
        "id" => 2,
        "student_name" => "John Smith",
        "course" => "BSCS 2B",
        "reason" => "Transferring school",
        "status" => "Pending"
    ]
];

// Return as JSON
echo json_encode($dropRequests);
?>
