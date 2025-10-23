<?php
require_once 'dbconnector.php';
header('Content-Type: application/json');

$sql = "SELECT classID, courseCode, courseName, instructor, dayOfWeek, startTime, endTime, room FROM Classes ORDER BY dayOfWeek, startTime";
$result = $conn->query($sql);

$classes = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $classes[] = $row;
    }
}

echo json_encode($classes);
$conn->close();
?>
