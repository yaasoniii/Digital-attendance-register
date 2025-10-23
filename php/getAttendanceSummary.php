<?php
session_start();
header('Content-Type: application/json');
require_once 'dbConnector.php';

$studentNo = $_GET['studentNo'] ?? null;
if (!$studentNo) {
    echo json_encode(['error' => 'Student number missing']);
    exit;
}

// 1. Get the courseCode of the student
$sqlCourse = "SELECT courseCode FROM Students WHERE studentNo = ?";
$stmtCourse = $conn->prepare($sqlCourse);
$stmtCourse->bind_param("i", $studentNo);
$stmtCourse->execute();
$courseResult = $stmtCourse->get_result();
$student = $courseResult->fetch_assoc();
$courseCode = $student['courseCode'] ?? null;

if (!$courseCode) {
    echo json_encode(['error' => 'Student course not found']);
    exit;
}

// 2. Total classes for this course
$sqlTotal = "SELECT COUNT(*) AS total FROM Classes WHERE courseCode = ?";
$stmtTotal = $conn->prepare($sqlTotal);
$stmtTotal->bind_param("s", $courseCode);
$stmtTotal->execute();
$totalResult = $stmtTotal->get_result()->fetch_assoc();
$totalClasses = $totalResult['total'] ?? 0;

// 3. Attended classes for this student
$sqlAttended = "SELECT COUNT(*) AS attended 
                FROM Attendance a
                JOIN Classes c ON a.classID = c.classID
                WHERE a.studentNo = ? AND c.courseCode = ? AND a.status = 'Present'";
$stmtAttended = $conn->prepare($sqlAttended);
$stmtAttended->bind_param("is", $studentNo, $courseCode);
$stmtAttended->execute();
$attendedResult = $stmtAttended->get_result()->fetch_assoc();
$attended = $attendedResult['attended'] ?? 0;

// 4. Return JSON
echo json_encode([
    'totalClasses' => $totalClasses,
    'attended' => $attended
]);

$conn->close();
?>
