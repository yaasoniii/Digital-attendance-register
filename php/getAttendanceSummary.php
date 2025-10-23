<?php
session_start();
header('Content-Type: application/json');
require_once 'dbConnector.php';

$studentNo = $_GET['studentNo'] ?? null;
if (!$studentNo) {
    echo json_encode(['error' => 'Student number missing']);
    exit;
}

// FIXED: Calculate total classes based on student's enrollments, not course match
// Total classes this student is enrolled in
$sqlTotal = "
    SELECT SUM(c.totalSessions) AS total
    FROM Enrollments e
    JOIN Classes c ON e.classID = c.classID
    WHERE e.studentNo = ?
";
$stmtTotal = $conn->prepare($sqlTotal);
$stmtTotal->bind_param("i", $studentNo);
$stmtTotal->execute();
$totalResult = $stmtTotal->get_result()->fetch_assoc();
$totalClasses = $totalResult['total'] ?? 0;

// Attended classes for this student
$sqlAttended = "SELECT COUNT(*) AS attended 
                FROM Attendance a
                WHERE a.studentNo = ? AND a.status = 'Present'";
$stmtAttended = $conn->prepare($sqlAttended);
$stmtAttended->bind_param("i", $studentNo);
$stmtAttended->execute();
$attendedResult = $stmtAttended->get_result()->fetch_assoc();
$attended = $attendedResult['attended'] ?? 0;

// Return JSON
echo json_encode([
    'totalClasses' => $totalClasses,
    'attended' => $attended
]);

$conn->close();
?>