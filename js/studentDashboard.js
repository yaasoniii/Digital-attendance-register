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

    document.getElementById("student-name").querySelector('span').textContent = student.firstName;
    document.getElementById("student-id").querySelector('span').textContent = student.studentNo;
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

    document.getElementById("total-classes").textContent = totalClasses;
    document.getElementById("attended-classes").textContent = attended;
    document.getElementById("attendance-rate").textContent = `${rate}%`;
  } catch (err) {
    console.error("Failed to fetch attendance summary:", err);
  }
}

// Fetch today's class - FIXED
async function fetchTodaysClass() {
  try {
    const response = await fetch(`../php/getTodaysClass.php`);
    const classData = await response.json();

    if (classData.error) {
      console.warn("No class found for today:", classData.error);
      document.getElementById("class-course").textContent = "No class today";
      document.getElementById("class-time").textContent = "--";
      document.getElementById("class-date").textContent = classData.date || new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      document.getElementById("class-room").textContent = "--";
      document.getElementById("class-instructor").textContent = "--";
      return;
    }

    // Update the "Today's Class" card
    document.getElementById("class-course").textContent = classData.courseName;
    document.getElementById("class-time").textContent = `${classData.startTime} - ${classData.endTime}`;
    document.getElementById("class-date").textContent = classData.date;
    document.getElementById("class-room").textContent = classData.room;
    document.getElementById("class-instructor").textContent = classData.instructor;

    // Check if class is starting soon
    checkClassSoon(classData.startTime);
  } catch (err) {
    console.error("Failed to fetch today's class:", err);
  }
}

// Check if class is starting soon
function checkClassSoon(startTimeStr) {
  const now = new Date();
  const [hours, minutes] = startTimeStr.split(':');
  const classStart = new Date();
  classStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  const diffMinutes = (classStart - now) / 60000;

  if (diffMinutes > 0 && diffMinutes <= 30) {
    document.getElementById("class-alert").classList.remove("hidden");
  }
}

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  window.location.href = "../index.html";
});

// Init
fetchStudentId();