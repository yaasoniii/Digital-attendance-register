-- Active: 1759930512323@@127.0.0.1@3306
-- Active: 1759930512323@@127.0.0.1@3306



USE attendanceLog;
CREATE TABLE Students(
studentNo INT PRIMARY KEY NOT NULL,
firstName VARCHAR(15),
lastName VARCHAR(25),
PasswordHash VARCHAR(255) NOT  NULL,
courseCode VARCHAR(15)
);


CREATE TABLE Admin(
adminID INT PRIMARY KEY AUTO_INCREMENT,
Name VARCHAR(15),
Surname VARCHAR(25),
username VARCHAR(30),
PasswordHash VARCHAR(255) NOT NULL
);

CREATE TABLE Attendance(
attendanceID INT PRIMARY KEY auto_increment,
studentNo INT NOT NULL,
attendanceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
status VARCHAR(10) NOT NULL,
FOREIGN KEY (studentNo) REFERENCES Students(studentNo)
);


CREATE TABLE qrCode(
    qrCodeId INT PRIMARY KEY AUTO_INCREMENT,
    studentNo INT NOT NULL,
    qrValue VARCHAR(255) NOT NULL,
    sessionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentNo) REFERENCES Students(studentNo)
);

CREATE TABLE Instructors (
    instructorID INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100)
);

CREATE TABLE Classes (
    classID INT PRIMARY KEY AUTO_INCREMENT,
    courseName VARCHAR(50) NOT NULL,
    dayOfWeek VARCHAR(10) NOT NULL,        -- e.g., Monday, Tuesday
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    room VARCHAR(50) NOT NULL,
    instructor VARCHAR(50) NOT NULL,
    courseCode VARCHAR(15) NOT NULL,       -- links to Students.courseCode
    UNIQUE(courseCode, dayOfWeek, startTime) -- avoid duplicate classes
);

CREATE TABLE Enrollments (
    enrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    studentNo INT NOT NULL,
    classID INT NOT NULL,
    FOREIGN KEY (studentNo) REFERENCES Students(studentNo),
    FOREIGN KEY (classID) REFERENCES Classes(classID)
);

CREATE TABLE Courses (
    courseCode VARCHAR(15) PRIMARY KEY,
    courseName VARCHAR(50) NOT NULL,
    totalSessions INT NOT NULL DEFAULT 0
);


INSERT INTO Enrollments (studentNo, classID)
SELECT s.studentNo, c.classID
FROM Students s
JOIN Classes c ON s.courseCode = c.courseCode;



