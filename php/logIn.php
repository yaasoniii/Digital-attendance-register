<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../php/dbConnector.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $userType = $_POST['S/A'] ?? 'student';
    
    if ($userType === 'student') {
        // STUDENT LOGIN 
        $studentNo = htmlspecialchars($_POST['studentNo'] ?? '');
        $password = htmlspecialchars($_POST['studentPassword'] ?? '');

        if (empty($studentNo) || empty($password)) {
            die("All fields are required!");
        }

        $sql = "SELECT * FROM Students WHERE studentNo = ?";
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            die("Database error: " . $conn->error);
        }

        $stmt->bind_param("i", $studentNo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();

            if (password_verify($password, $user['PasswordHash'])) {
                $_SESSION['studentNo'] = $user['studentNo'];
                $_SESSION['userName'] = $user['Name'];
                $_SESSION['userSurname'] = $user['Surname'];
                $_SESSION['userType'] = 'student';

                header("Location: ../html/indexForStudentDashboard.html");
                exit();
            } else {
                echo "<script>alert('Invalid password!'); window.history.back();</script>";
            }
        } else {
            echo "<script>alert('Student not found!'); window.history.back();</script>";
        }
        $stmt->close();

    } else if($userType === 'admin') {
        // ADMIN LOGIN
        $adminUsername = htmlspecialchars($_POST['adminUsername'] ?? '');
        $adminPassword = htmlspecialchars($_POST['adminPassword'] ?? '');

        if (empty($adminUsername) || empty($adminPassword)) {
            die("All fields are required!");
        }

        $sql = "SELECT * FROM Admin WHERE username = ?";
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            die("Database error: " . $conn->error);
        }

        $stmt->bind_param("s", $adminUsername);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $admin = $result->fetch_assoc();

            if (password_verify($adminPassword, $admin['PasswordHash'])) {
                $_SESSION['admin_id'] = $admin['adminID'];
                $_SESSION['admin_username'] = $admin['username'];
                $_SESSION['userType'] = 'admin';

                header("Location: ../html/indexForDashboardAdmin.html");
                exit();
            } else {
                echo "<script>alert('Invalid admin password!'); window.history.back();</script>";
            }
        } else {
            echo "<script>alert('Admin not found!'); window.history.back();</script>";
        }
        $stmt->close();
    }

    $conn->close();
}
?>