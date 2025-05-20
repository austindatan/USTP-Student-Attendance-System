<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $dropRequests = [
            [
                "drop_request_id" => 1,
                "attendance_id" => 101,
                "student_name" => "John Doe",
                "course" => "BSIT",
                "instructor" => "Prof. Smith",
                "reason" => "Gi hutoy ug wala nakasukol sa kakapoy.",
                "status" => "Pending"
            ],
            [
                "drop_request_id" => 2,
                "attendance_id" => 102,
                "student_name" => "Jane Roe",
                "course" => "BSCS",
                "instructor" => "Prof. Lee",
                "reason" => "Nag kalibanga tunga sa klase, wa na kabalik, nag igita, wala na kabalo sa buhaton, ga basa na, tas gihaplasan pajud, mas nisakit ang tiyan.",
                "status" => "Approved"
            ]
        ];
        echo json_encode($dropRequests);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode(["message" => "Drop request created (mock)"]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode(["message" => "Drop request updated (mock)"]);
        break;

    default:
        echo json_encode(["error" => "Invalid request"]);
        break;
}
