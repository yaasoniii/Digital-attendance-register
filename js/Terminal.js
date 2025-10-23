document.addEventListener('DOMContentLoaded', function() {
  const attendanceList = document.getElementById('attendanceList');
  const checkCount = document.getElementById('checkCount');
  const currentTime = document.getElementById('currentTime');
  let currentCheckIns = 0;
  let isScanning = true;

  // Update current time every second
  function updateTime() {
    const now = new Date();
    currentTime.textContent = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  updateTime();
  setInterval(updateTime, 1000);

  // success or error
function showPopup(studentName, courseName, isError = false) {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.style.backgroundColor = isError ? '#c0392b' : '#2c3e50'; // red for error, dark blue for success
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-text">${isError ? 'Error!' : 'Registered!'}</span>
        ${studentName ? `<span class="popup-name">${studentName}</span>` : ''}
        ${courseName ? `<span class="popup-course">${courseName}</span>` : ''}
      </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}


  // Add student to attendance list
  function addStudentToList(studentName, courseName) {
    if (currentCheckIns === 0) attendanceList.innerHTML = '';

    const scanTime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const studentItem = document.createElement('div');
    studentItem.className = 'student-item';
    studentItem.innerHTML = `
      <div class="student-info">
        <span class="student-name">${studentName}</span>
        <span class="student-course">${courseName}</span>
        <span class="student-id">Checked in at ${scanTime}</span>
      </div>
    `;
    attendanceList.prepend(studentItem);
    currentCheckIns++;
    checkCount.textContent = currentCheckIns;
  }

  // Call PHP to mark attendance
  async function markAttendance(qrValue) {
    try {
      const res = await fetch("../php/markAttendance.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: qrValue })
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      return {
        studentName: data.studentName,
        courseName: data.courseName
      };
    } catch (err) {
      console.error('Attendance error:', err);
      showPopup(null, err.message, true);
      return null;
    }
  }

  // On QR scan success
  async function onScanSuccess(decodedText) {
    if (!isScanning) return;
    isScanning = false;

    const attendanceData = await markAttendance(decodedText);
    if (attendanceData) {
      addStudentToList(attendanceData.studentName, attendanceData.courseName);
      showPopup(attendanceData.studentName, attendanceData.courseName, false);
    }

    setTimeout(() => { isScanning = true; }, 3000);
  }

  const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
  html5QrcodeScanner.render(onScanSuccess);
});
