-- Drop existing database and recreate
DROP DATABASE IF EXISTS attendanceLog1;
CREATE DATABASE attendanceLog1;
USE attendanceLog1;

-- Students Table
CREATE TABLE Students(
    studentNo INT PRIMARY KEY NOT NULL,
    firstName VARCHAR(15),
    lastName VARCHAR(25),
    PasswordHash VARCHAR(255) NOT NULL,
    courseCode VARCHAR(15)
);

-- Admin Table
CREATE TABLE Admin(
    adminID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(15),
    Surname VARCHAR(25),
    username VARCHAR(30),
    PasswordHash VARCHAR(255) NOT NULL
);

-- Instructors Table
CREATE TABLE Instructors (
    instructorID INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100)
);

-- Classes Table (UPDATED - Added totalSessions)
CREATE TABLE Classes (
    classID INT PRIMARY KEY AUTO_INCREMENT,
    courseName VARCHAR(50) NOT NULL,
    courseCode VARCHAR(15) NOT NULL,
    dayOfWeek VARCHAR(15) NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    room VARCHAR(50) NOT NULL,
    instructor VARCHAR(50) NOT NULL,
    totalSessions INT NOT NULL DEFAULT 12,
    UNIQUE(courseCode, dayOfWeek, startTime)
);

-- Courses Table
CREATE TABLE Courses (
    courseCode VARCHAR(15) PRIMARY KEY,
    courseName VARCHAR(50) NOT NULL,
    totalSessions INT NOT NULL DEFAULT 0
);

-- Enrollments Table
CREATE TABLE Enrollments (
    enrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    studentNo INT NOT NULL,
    classID INT NOT NULL,
    FOREIGN KEY (studentNo) REFERENCES Students(studentNo) ON DELETE CASCADE,
    FOREIGN KEY (classID) REFERENCES Classes(classID) ON DELETE CASCADE
);

-- Attendance Table
CREATE TABLE Attendance(
    attendanceID INT PRIMARY KEY AUTO_INCREMENT,
    studentNo INT NOT NULL,
    classID INT NOT NULL,
    attendanceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL,
    FOREIGN KEY (studentNo) REFERENCES Students(studentNo) ON DELETE CASCADE,
    FOREIGN KEY (classID) REFERENCES Classes(classID) ON DELETE CASCADE
);

-- QR Code Table
CREATE TABLE qrCode(
    qrCodeId INT PRIMARY KEY AUTO_INCREMENT,
    studentNo INT NOT NULL,
    qrValue VARCHAR(255) NOT NULL,
    sessionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentNo) REFERENCES Students(studentNo) ON DELETE CASCADE
);

-- Sample Data
-- Insert a sample course
INSERT INTO Courses (courseCode, courseName, totalSessions) 
VALUES ('WAD', 'Web Application Development', 12);

-- Insert a sample instructor
INSERT INTO Instructors (firstName, lastName, email) 
VALUES ('John', 'Doe', 'john.doe@example.com');

-- Insert sample classes for different days
INSERT INTO Classes (courseName, courseCode, dayOfWeek, startTime, endTime, room, instructor, totalSessions)
VALUES 
    ('Web Application Development', 'WAD', 'Monday', '09:30:00', '11:00:00', 'A101', 'John Doe', 12),
    ('Web Application Development', 'WAD', 'Wednesday', '09:30:00', '11:00:00', 'A101', 'John Doe', 12),
    ('Web Application Development', 'WAD', 'Thursday', '14:00:00', '16:00:00', 'B202', 'John Doe', 12),
    ('Web Application Development', 'WAD', 'Friday', '16:00:00', '18:00:00', 'B202', 'John Doe', 12);

-- Insert a sample student (password is "1234")
INSERT INTO Students (studentNo, firstName, lastName, PasswordHash, courseCode)
VALUES (224081985, 'Test', 'Student', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'WAD');

-- Auto-enroll the student in all WAD classes
INSERT INTO Enrollments (studentNo, classID)
SELECT 224081985, classID
FROM Classes
WHERE courseCode = 'WAD';