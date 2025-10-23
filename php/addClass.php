<?php
header('Content-Type: application/json');
require_once '../php/dbConnector.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $courseCode  = $_POST['courseCode'] ?? '';
    $courseName  = $_POST['courseName'] ?? '';
    $instructor  = $_POST['instructor'] ?? '';
    $dayOfWeek   = $_POST['dayOfWeek'] ?? '';
    $startTime   = $_POST['startTime'] ?? '';
    $endTime     = $_POST['endTime'] ?? '';
    $room        = $_POST['room'] ?? '';

    // check for missing fields
    if (!$courseCode || !$courseName || !$instructor || !$dayOfWeek || !$startTime || !$endTime || !$room) {
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO Classes (courseName, dayOfWeek, startTime, endTime, room, instructor, courseCode)
                                VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $courseName, $dayOfWeek, $startTime, $endTime, $room, $instructor, $courseCode);
        $stmt->execute();

        echo json_encode(['Class added successfully']);
    } catch (mysqli_sql_exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }

} else {
    echo json_encode(['error' => 'Invalid request method']);
}
