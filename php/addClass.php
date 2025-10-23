<?php
header('Content-Type: application/json');
require_once '../php/dbConnector.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $courseCode     = trim($_POST['courseCode'] ?? '');
    $courseName     = trim($_POST['courseName'] ?? '');
    $totalSessions  = intval($_POST['totalSessions'] ?? 12);
    $instructor     = trim($_POST['instructor'] ?? '');
    $dayOfWeek      = trim($_POST['dayOfWeek'] ?? '');
    $startTime      = trim($_POST['startTime'] ?? '');
    $endTime        = trim($_POST['endTime'] ?? '');
    $room           = trim($_POST['room'] ?? '');

    // Validate required fields
    if (!$courseCode || !$courseName || !$instructor || !$dayOfWeek || !$startTime || !$endTime || !$room) {
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }

    // Validate totalSessions
    if ($totalSessions < 1) {
        echo json_encode(['error' => 'Total sessions must be at least 1']);
        exit;
    }

    try {
        // Insert class with totalSessions
        $stmt = $conn->prepare("
            INSERT INTO Classes (courseName, courseCode, dayOfWeek, startTime, endTime, room, instructor, totalSessions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("sssssssi", $courseName, $courseCode, $dayOfWeek, $startTime, $endTime, $room, $instructor, $totalSessions);
        $stmt->execute();

        echo json_encode(['success' => 'Class added successfully', 'totalSessions' => $totalSessions]);
    } catch (mysqli_sql_exception $e) {
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            echo json_encode(['error' => 'A class with this code, day, and time already exists']);
        } else {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

} else {
    echo json_encode(['error' => 'Invalid request method']);
}

$conn->close();
?>