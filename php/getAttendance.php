<?php
header('Content-Type: application/json');
require_once '../php/dbConnector.php';

// gets all the attendance entries.
$sql = "
    SELECT a.attendanceID, s.firstName, s.lastName, s.studentNo, a.attendanceDate, a.status
    FROM Attendance a
    JOIN Students s ON a.studentNo = s.studentNo
    ORDER BY a.attendanceDate DESC
";

$result = $conn->query($sql);
$attendance = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $attendance[] = $row;
    }
}

echo json_encode($attendance);
$conn->close();
?>
