<?php
header('Content-Type: application/json');
require_once '../php/dbConnector.php';

// Get the day parameter (e.g., "Monday")
$day = $_GET['day'] ?? date('l');

// Get all students enrolled in classes scheduled for the given day
$sql = "
    SELECT DISTINCT 
        s.studentNo, 
        s.firstName, 
        s.lastName, 
        c.moduleName,
        c.moduleCode,
        c.startTime,
        c.endTime
    FROM Students s
    INNER JOIN Enrollments e ON s.studentNo = e.studentNo
    INNER JOIN Classes c ON e.classID = c.classID
    WHERE c.dayOfWeek = ?
    ORDER BY s.lastName, s.firstName
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $day);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

echo json_encode($students);
$conn->close();
?>