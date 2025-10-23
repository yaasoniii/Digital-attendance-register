<?php
session_start();
header('Content-Type: application/json');
require_once '../php/dbConnector.php';

// Get studentNo from session
$studentNo = $_SESSION['studentNo'] ?? null;

if (!$studentNo) {
    echo json_encode(['error' => 'Student not logged in']);
    exit;
}

$sql = "SELECT studentNo, firstName, lastName, courseCode FROM Students WHERE studentNo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $studentNo);
$stmt->execute();
$result = $stmt->get_result();
$student = $result->fetch_assoc() ?: null;

if (!$student) {
    echo json_encode(['error' => 'Student not found']);
    exit;
}

echo json_encode($student);
$conn->close();
?>
