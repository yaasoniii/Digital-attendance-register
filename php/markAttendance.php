<?php
error_reporting(0);        
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json');

require_once 'dbConnector.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$studentNo = $input['studentId'] ?? null;

if (!$studentNo) {
    echo json_encode(['error' => 'Student ID missing']);
    exit;
}

// Check if student exists
$stmtStudent = $conn->prepare("SELECT firstName, lastName FROM Students WHERE studentNo = ?");
$stmtStudent->bind_param("i", $studentNo);
$stmtStudent->execute();
$resultStudent = $stmtStudent->get_result();

if (!$student = $resultStudent->fetch_assoc()) {
    echo json_encode(['error' => 'Student not found']);
    exit;
}

//  Check if there is a class today for this student
$sqlClass = "
SELECT c.classID, c.courseName
FROM Enrollments e
JOIN Classes c ON e.classID = c.classID
WHERE e.studentNo = ? AND c.dayOfWeek = DAYNAME(CURDATE())
LIMIT 1
";

$stmtClass = $conn->prepare($sqlClass);
$stmtClass->bind_param("i", $studentNo);
$stmtClass->execute();
$resultClass = $stmtClass->get_result();

if (!$class = $resultClass->fetch_assoc()) {
    echo json_encode(['error' => 'No class scheduled for today']);
    exit;
}

$classID = $class['classID'];

//  Check if already marked
$stmtCheck = $conn->prepare("SELECT * FROM Attendance WHERE studentNo = ? AND classID = ?");
$stmtCheck->bind_param("ii", $studentNo, $classID);
$stmtCheck->execute();
if ($stmtCheck->get_result()->num_rows > 0) {
    echo json_encode(['error' => 'Already checked in for today']);
    exit;
}

// Mark attendance
$stmtInsert = $conn->prepare("INSERT INTO Attendance (studentNo, classID, status) VALUES (?, ?, 'Present')");
$stmtInsert->bind_param("ii", $studentNo, $classID);
$stmtInsert->execute();

echo json_encode([
    'studentName' => $student['firstName'] . ' ' . $student['lastName'],
    'courseName' => $class['courseName']
]);

$conn->close();
