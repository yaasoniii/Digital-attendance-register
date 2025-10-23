<?php
session_start();
header('Content-Type: application/json');

// Make sure studentNo is set in session after login
if (!isset($_SESSION['studentNo'])) {
    echo json_encode(['error' => 'No student logged in']);
    exit;
}

echo json_encode(['studentNo' => $_SESSION['studentNo']]);


//did i use this?
?>
