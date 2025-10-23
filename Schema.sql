-- Drop existing database and recreate
DROP DATABASE IF EXISTS attendanceLog1;
CREATE DATABASE attendanceLog1;
USE attendanceLog1;

-- Students Table (courseCode = their main program like 07BCMS)
CREATE TABLE Students(
    studentNo INT PRIMARY KEY NOT NULL,
    firstName VARCHAR(15),
    lastName VARCHAR(25),
    PasswordHash VARCHAR(255) NOT NULL,
    courseCode VARCHAR(15)  -- Main program code like 07BCMS
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

-- Programs Table (Main courses like 07BCMS)
CREATE TABLE Programs (
    programCode VARCHAR(15) PRIMARY KEY,
    programName VARCHAR(100) NOT NULL
);

-- Modules Table (Subjects under programs like WAD)
CREATE TABLE Modules (
    moduleCode VARCHAR(15) PRIMARY KEY,
    moduleName VARCHAR(100) NOT NULL,
    programCode VARCHAR(15),
    FOREIGN KEY (programCode) REFERENCES Programs(programCode) ON DELETE CASCADE
);

-- Classes Table (Now uses moduleCode instead of courseCode)
CREATE TABLE Classes (
    classID INT PRIMARY KEY AUTO_INCREMENT,
    moduleCode VARCHAR(15) NOT NULL,
    moduleName VARCHAR(50) NOT NULL,
    dayOfWeek VARCHAR(15) NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    room VARCHAR(50) NOT NULL,
    instructor VARCHAR(50) NOT NULL,
    totalSessions INT NOT NULL DEFAULT 12,
    FOREIGN KEY (moduleCode) REFERENCES Modules(moduleCode) ON DELETE CASCADE,
    UNIQUE(moduleCode, dayOfWeek, startTime)
);

-- Enrollments Table (Links students to specific classes)
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

-- ===== Sample Data =====

-- Insert Programs
INSERT INTO Programs (programCode, programName) VALUES 
('07BCMS', 'Bachelor of Computer Science'),
('07BENG', 'Bachelor of Engineering'),
('07BACC', 'Bachelor of Accounting');

-- Insert Modules under 07BCMS
INSERT INTO Modules (moduleCode, moduleName, programCode) VALUES 
('WAD', 'Web Application Development', '07BCMS'),
('DSA', 'Data Structures and Algorithms', '07BCMS'),
('DB', 'Database Systems', '07BCMS'),
('OS', 'Operating Systems', '07BCMS');

-- Insert a sample instructor
INSERT INTO Instructors (firstName, lastName, email) 
VALUES ('Josephina', 'Muntuumo', 'josephinamuntuumo@nust.na');




-- Auto-enroll the student in all WAD classes
-- This is the KEY: Students in 07BCMS can be enrolled in WAD classes
INSERT INTO Enrollments (studentNo, classID)
SELECT 224081349, classID
FROM Classes
WHERE moduleCode = 'WAD';