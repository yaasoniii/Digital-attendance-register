<?php
session_start();
header('Content-Type: application/json');
require_once '../php/dbConnector.php';

$studentNo = $_SESSION['studentNo'] ?? null;

if (!$studentNo) {
    echo json_encode(['error' => 'Student not logged in']);
    exit;
}

// Check if a QR already exists for this student
$stmt = $conn->prepare("SELECT qrValue FROM qrCode WHERE studentNo = ? ORDER BY sessionTimestamp DESC LIMIT 1");
$stmt->bind_param("i", $studentNo);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $qrValue = $row['qrValue'];
} else {
    // Generate new QR if none exists
    $qrValue = $studentNo . '-' . uniqid();
    $insert = $conn->prepare("INSERT INTO qrCode (studentNo, qrValue) VALUES (?, ?)");
    $insert->bind_param("is", $studentNo, $qrValue);
    $insert->execute();
}

echo json_encode(['qrValue' => $qrValue]);
$conn->close();
?>
