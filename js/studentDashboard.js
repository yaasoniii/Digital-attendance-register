let studentId = null;

// Get logged-in student ID from session
async function fetchStudentId() {
  try {
    const response = await fetch("../php/getSessionStudent.php");
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    studentId = data.studentNo;

    // Once we have the studentId, fetch the rest
    fetchStudentInfo();
    generateQr();
    fetchAttendanceSummary();
    fetchTodaysClass();
  } catch (err) {
    console.error("Failed to get student session:", err);
  }
}

// Fetch student info
async function fetchStudentInfo() {
  try {
    const response = await fetch(`../php/getStudentSessionInfo.php`);
    const student = await response.json();

    document.getElementById("student-name").textContent = `Welcome, ${student.firstName}!`;
    document.getElementById("student-id").textContent = `Student ID: ${student.studentNo}`;
    document.getElementById("info-name").textContent = `${student.firstName} ${student.lastName}`;
    document.getElementById("info-id").textContent = student.studentNo;
    document.getElementById("info-course").textContent = student.courseCode;
  } catch (err) {
    console.error("Failed to fetch student info:", err);
  }
}

// Update current time
const currentTimeEl = document.getElementById("current-time");
setInterval(() => {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString("en-US", { hour12: true });
}, 1000);

// Generate QR code
async function generateQr() {
  try {
    const response = await fetch("../php/getQr.php");
    const data = await response.json();
    if (!data.qrValue) throw new Error("QR value missing");

    const qr = new QRCodeStyling({
      width: 250,
      height: 250,
      data: data.qrValue,
      dotsOptions: { color: "#1e293b", type: "rounded" },
      backgroundOptions: { color: "#ffffff" },
      cornersSquareOptions: { color: "#3b82f6", type: "extra-rounded" },
      cornersDotOptions: { color: "#3b82f6", type: "dot" }
    });

    const qrContainer = document.getElementById("qr-code");
    qrContainer.innerHTML = "";
    qr.append(qrContainer);

    document.getElementById("download-btn").onclick = () => {
      qr.download({ name: `qr-code-${studentId}`, extension: "png" });
    };
  } catch (err) {
    console.error("Failed to generate QR:", err);
  }
}


// Fetch attendance summary
async function fetchAttendanceSummary() {
  try {
    const response = await fetch(`../php/getAttendanceSummary.php?studentNo=${studentId}`);
    const summary = await response.json();

    const totalClasses = summary.totalClasses || 0;
    const attended = summary.attended || 0;
    const rate = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0;

    document.querySelector(".stats div:nth-child(1) strong").textContent = totalClasses;
    document.querySelector(".stats div:nth-child(2) strong").textContent = attended;
    document.querySelector(".stats div:nth-child(3) strong").textContent = `${rate}%`;
  } catch (err) {
    console.error("Failed to fetch attendance summary:", err);
  }
}

// Fetch today's class
async function fetchTodaysClass() {
  try {
    const response = await fetch(`../php/getTodaysClass.php?studentNo=${studentId}`);
    const classData = await response.json();

    if (!classData || classData.error) {
      console.warn("No class found for today.");
      return;
    }

    const card = document.querySelector(".left .card:nth-child(2)");
    card.querySelector("p:nth-child(2)").innerHTML = `<strong>Course:</strong> ${classData.courseName}`;
    card.querySelector("p:nth-child(3)").innerHTML = `<strong>Time:</strong> ${classData.startTime} - ${classData.endTime}`;
    card.querySelector("p:nth-child(4)").innerHTML = `<strong>Date:</strong> ${classData.date}`;
    card.querySelector("p:nth-child(5)").innerHTML = `<strong>Room:</strong> ${classData.room}`;
    card.querySelector("p:nth-child(6)").innerHTML = `<strong>Instructor:</strong> ${classData.instructor}`;
  } catch (err) {
    console.error("Failed to fetch today's class:", err);
  }
}

// Check if class is starting soon
function checkClassSoon() {
  const now = new Date();
  const start = new Date();
  start.setHours(9, 30, 0, 0); // adjust as needed
  const diff = (start - now) / 60000;

  if (diff > 0 && diff <= 30) {
    document.getElementById("class-alert").classList.remove("hidden");
  }
}

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  window.location.href = "../index.html";
});

// Init
fetchStudentId();
checkClassSoon();
