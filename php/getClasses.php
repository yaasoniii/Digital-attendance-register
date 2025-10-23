<?php
require_once 'dbconnector.php';
header('Content-Type: application/json');

// Now returns moduleCode instead of courseCode
$sql = "SELECT classID, moduleCode, moduleName, instructor, dayOfWeek, startTime, endTime, room, totalSessions 
        FROM Classes 
        ORDER BY 
        CASE dayOfWeek
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            WHEN 'Saturday' THEN 6
            WHEN 'Sunday' THEN 7
        END,
        startTime";
        
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