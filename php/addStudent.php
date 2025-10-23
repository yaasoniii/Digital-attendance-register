<?php
require_once '../php/dbConnector.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $studentNo = trim($_POST['studentId']); 
    $firstName = trim($_POST['studentName']);
    $lastName = trim($_POST['studentSurname']);
    $pin = trim($_POST['studentPin']);
    $course = trim($_POST['studentCourse']);

    if (!$studentNo || !$firstName || !$lastName || !$pin || !$course) {
        echo "All fields are required!";
        exit;
    }

    // Check if studentNo already exists
    $stmtCheck = $conn->prepare("SELECT studentNo FROM Students WHERE studentNo = ?");
    $stmtCheck->bind_param("i", $studentNo);
    $stmtCheck->execute();
    $stmtCheck->store_result();
    if ($stmtCheck->num_rows > 0) {
        echo "Student number already exists!";
        exit;
    }
    $stmtCheck->close();

    $pinHash = password_hash($pin, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO Students (studentNo, firstName, lastName, PasswordHash, courseCode) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $studentNo, $firstName, $lastName, $pinHash, $course);

    if ($stmt->execute()) {
        echo "Student added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
