<?php
require_once '../php/dbConnector.php';
// for adding admin
$adminID = "A23";
$adminName = "Jason";           
$adminSurname = "Nghiilwamo";    
$adminUsername = "jnghiilwamo@admin";
$password = "yU7*I";

$hashedPass = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO Admin (adminID, Name, Surname, username, PasswordHash) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $adminID, $adminName, $adminSurname, $adminUsername, $hashedPass);

if ($stmt->execute()) {
  echo "Admin added successfully!";
} else {
  echo "Error: " . $stmt->error;
}
?>
