<?php
error_reporting(0);        
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json');

require_once 'dbConnector.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$qrValue = $input['studentId'] ?? null;

if (!$qrValue) {
    echo json_encode(['error' => 'Student ID missing']);
    exit;
}

$parts = explode('-', $qrValue);
$studentNo = $parts[0] ?? null;

if (!$studentNo || !is_numeric($studentNo)) {
    echo json_encode(['error' => 'Invalid QR code format']);
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

// Get current day and time - FIXED to match database format
$currentDay = date('l'); // Returns "Monday", "Tuesday", "Wednesday", "Thursday", etc.
$currentTime = date('H:i:s');

// Find class that is happening NOW for this student
$sqlClass = "
SELECT c.classID, c.courseName, c.startTime, c.endTime, c.dayOfWeek
FROM Enrollments e
JOIN Classes c ON e.classID = c.classID
WHERE e.studentNo = ? 
  AND c.dayOfWeek = ?
  AND TIME(?) BETWEEN c.startTime AND c.endTime
LIMIT 1
";

$stmtClass = $conn->prepare($sqlClass);
$stmtClass->bind_param("iss", $studentNo, $currentDay, $currentTime);
$stmtClass->execute();
$resultClass = $stmtClass->get_result();

if (!$class = $resultClass->fetch_assoc()) {
    // Try to find ANY class today (even if not currently happening)
    $sqlAnyClass = "
    SELECT c.classID, c.courseName, c.startTime, c.endTime, c.dayOfWeek
    FROM Enrollments e
    JOIN Classes c ON e.classID = c.classID
    WHERE e.studentNo = ? 
      AND c.dayOfWeek = ?
    LIMIT 1
    ";
    
    $stmtAny = $conn->prepare($sqlAnyClass);
    $stmtAny->bind_param("is", $studentNo, $currentDay);
    $stmtAny->execute();
    $resultAny = $stmtAny->get_result();
    
    if ($classAny = $resultAny->fetch_assoc()) {
        echo json_encode([
            'error' => "Class '{$classAny['courseName']}' is scheduled for {$classAny['startTime']} - {$classAny['endTime']}. Current time: " . date('H:i:s')
        ]);
    } else {
        echo json_encode([
            'error' => "No class scheduled for {$currentDay}. Make sure you're enrolled and the class day matches exactly."
        ]);
    }
    exit;
}

$classID = $class['classID'];

// Check if already marked for THIS specific class today
$today = date('Y-m-d');
$stmtCheck = $conn->prepare("
    SELECT * FROM Attendance 
    WHERE studentNo = ? 
      AND classID = ? 
      AND DATE(attendanceDate) = ?
");
$stmtCheck->bind_param("iis", $studentNo, $classID, $today);
$stmtCheck->execute();
if ($stmtCheck->get_result()->num_rows > 0) {
    echo json_encode(['error' => 'Already checked in for this class today']);
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
?>