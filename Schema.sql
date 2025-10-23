-- Active: 1759930512323@@127.0.0.1@3306@attendancelog1
-- Drop existing database and recreate
DROP DATABASE IF EXISTS attendanceLog;
CREATE DATABASE attendanceLog;

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
    adminID INT PRIMARY KEY AUTO_INCREMENT,
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

-- Classes Table
CREATE TABLE Classes (
    classID INT PRIMARY KEY AUTO_INCREMENT,
    courseName VARCHAR(50) NOT NULL,
    dayOfWeek VARCHAR(10) NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    room VARCHAR(50) NOT NULL,
    instructor VARCHAR(50) NOT NULL,
    courseCode VARCHAR(15) NOT NULL,
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
    FOREIGN KEY (studentNo) REFERENCES Students(studentNo),
    FOREIGN KEY (classID) REFERENCES Classes(classID)
);

-- Attendance Table (FIXED - Added classID)
CREATE TABLE Attendance(
    attendanceID INT PRIMARY KEY AUTO_INCREMENT,
    studentNo INT NOT NULL,
    classID INT NOT NULL,
    attendanceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL,
    FOREIGN KEY (studentNo) REFERENCES Students(studentNo),
    FOREIGN KEY (classID) REFERENCES Classes(classID)
);

-- QR Code Table
CREATE TABLE qrCode(
    qrCodeId INT PRIMARY KEY AUTO_INCREMENT,
    studentNo INT NOT NULL,
    qrValue VARCHAR(255) NOT NULL,
    sessionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentNo) REFERENCES Students(studentNo)
);

-- Sample Data (Optional - for testing)
-- Insert a sample course
INSERT INTO Courses (courseCode, courseName, totalSessions) 
VALUES ('WAD', 'Web Application Development', 12);

-- Insert a sample instructor
INSERT INTO Instructors (firstName, lastName, email) 
VALUES ('John', 'Doe', 'john.doe@example.com');

-- Insert sample classes for different times
INSERT INTO Classes (courseName, dayOfWeek, startTime, endTime, room, instructor, courseCode)
VALUES 
    ('Web Application Development', 'Monday', '09:30:00', '11:00:00', 'A101', 'John Doe', 'WAD'),
    ('Web Application Development', 'Wednesday', '09:30:00', '11:00:00', 'A101', 'John Doe', 'WAD'),
    ('Web Application Development', 'Friday', '04:00:00', '06:00:00', 'B202', 'John Doe', 'WAD');

-- Insert a sample student (password is "1234")
INSERT INTO Students (studentNo, firstName, lastName, PasswordHash, courseCode)
VALUES (224081985, 'Test', 'Student', '$2y$10$YourHashedPasswordHere', 'WAD');

-- Auto-enroll the student in all WAD classes
INSERT INTO Enrollments (studentNo, classID)
SELECT s.studentNo, c.classID
FROM Students s
JOIN Classes c ON s.courseCode = c.courseCode
WHERE s.studentNo = 224012345;