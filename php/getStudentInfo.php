<?php
session_start();
header('Content-Type: application/json');
require_once '../php/dbConnector.php';

// Fetch all students
$sql = "SELECT studentNo AS student_id, firstName AS first_name, lastName AS last_name, courseCode AS course FROM Students";
$result = $conn->query($sql);

$students = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

echo json_encode($students);
$conn->close();
?>
