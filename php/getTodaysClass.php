<?php
session_start();
header('Content-Type: application/json');

require_once '../php/dbConnector.php';

$studentNo = $_SESSION['studentNo'] ?? null;

if (!$studentNo) {
    echo json_encode(['error' => 'Student not logged in']);
    exit;
}

$sql = "
SELECT c.courseName, c.startTime, c.endTime, c.dayOfWeek, c.room,
       i.firstName AS instructorFirst, i.lastName AS instructorLast
FROM Enrollments e
JOIN Classes c ON e.classID = c.classID
JOIN Instructors i ON c.instructorID = i.instructorID
WHERE e.studentNo = ? AND c.dayOfWeek = DAYNAME(CURDATE())
LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $studentNo);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        'courseName' => $row['courseName'],
        'startTime' => $row['startTime'],
        'endTime' => $row['endTime'],
        'dayOfWeek' => $row['dayOfWeek'],
        'room' => $row['room'],
        'instructor' => $row['instructorFirst'] . ' ' . $row['instructorLast']
    ]);
} else {
    echo json_encode(['error' => 'No class found for today']);
}

$conn->close();
?>
