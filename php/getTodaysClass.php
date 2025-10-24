<?php
session_start();
header('Content-Type: application/json');

require_once '../php/dbConnector.php';

$studentNo = $_SESSION['studentNo'] ?? null;

if (!$studentNo) {
    echo json_encode(['error' => 'Student not logged in']);
    exit;
}

// Get current day name
$currentDay = date('l');

// This allows 07BCMS students to see their WAD classes
$sql = "
SELECT c.moduleName, c.moduleCode, c.startTime, c.endTime, c.dayOfWeek, c.room, c.instructor
FROM Enrollments e
JOIN Classes c ON e.classID = c.classID
WHERE e.studentNo = ? AND c.dayOfWeek = ?
ORDER BY c.startTime ASC
LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $studentNo, $currentDay);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        'courseName' => $row['moduleName'],
        'startTime' => date('H:i', strtotime($row['startTime'])),
        'endTime' => date('H:i', strtotime($row['endTime'])),
        'dayOfWeek' => $row['dayOfWeek'],
        'date' => date('l, F j, Y'),
        'room' => $row['room'],
        'instructor' => $row['instructor'],
        'courseCode' => $row['moduleCode']
    ]);
} else {
    echo json_encode([
        'error' => 'No class found for today',
        'date' => date('l, F j, Y')
    ]);
}

$conn->close();
?>