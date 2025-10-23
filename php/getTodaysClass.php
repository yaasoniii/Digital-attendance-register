<?php
session_start();
header('Content-Type: application/json');

require_once '../php/dbConnector.php';

$studentNo = $_SESSION['studentNo'] ?? null;

if (!$studentNo) {
    echo json_encode(['error' => 'Student not logged in']);
    exit;
}

// Get current day name - FIXED to use full day names
$currentDay = date('l'); // Returns "Monday", "Tuesday", "Wednesday", "Thursday", etc.

// Get today's class for this student
$sql = "
SELECT c.courseName, c.startTime, c.endTime, c.dayOfWeek, c.room,
       c.instructor, c.courseCode
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
        'courseName' => $row['courseName'],
        'startTime' => date('H:i', strtotime($row['startTime'])),
        'endTime' => date('H:i', strtotime($row['endTime'])),
        'dayOfWeek' => $row['dayOfWeek'],
        'date' => date('l, F j, Y'),
        'room' => $row['room'],
        'instructor' => $row['instructor'],
        'courseCode' => $row['courseCode']
    ]);
} else {
    echo json_encode([
        'error' => 'No class found for today'
    ]);
}

$conn->close();
?>