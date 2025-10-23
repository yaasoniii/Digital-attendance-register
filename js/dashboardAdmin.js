const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const navLinks = sidebar.querySelectorAll('nav a');

// Toggle sidebar
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show');
  overlay?.classList.toggle('show');
});

// Close sidebar on overlay click
overlay?.addEventListener('click', () => {
  sidebar.classList.remove('show');
  overlay.classList.remove('show');
});

// Close sidebar on nav link click (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    }
  });
});

// Update attendance stats dynamically
function updateAttendanceStats(enrolledStudents, attendanceRecords) {
  const total = enrolledStudents.length;
  
  // Count present, late, and absent
  let present = 0, late = 0;
  
  attendanceRecords.forEach(record => {
    if (record.status.toLowerCase() === 'present') present++;
    if (record.status.toLowerCase() === 'late') late++;
  });
  
  // Absent = total enrolled - (present + late)
  const absent = total - (present + late);

  document.getElementById("totalStudents").textContent = total;
  document.getElementById("presentStudents").textContent = present;
  document.getElementById("absentStudents").textContent = absent;
  document.getElementById("lateStudents").textContent = late;

  const percent = total > 0 ? Math.round((present / total) * 100) : 0;
  document.getElementById("presentPercent").textContent = `${percent}% attendance`;
}

// Load and render all students with their attendance status
async function loadRecentAttendance() {
  const tableBody = document.querySelector(".attendance-table tbody");
  const cardsContainer = document.querySelector(".attendance-cards");

  try {
    // Get current day
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    // Fetch enrolled students and attendance records
    const [studentsRes, attendanceRes] = await Promise.all([
      fetch(`../php/getEnrolledStudents.php?day=${currentDay}`),
      fetch("../php/getAttendance.php")
    ]);
    
    const enrolledStudents = await studentsRes.json();
    const attendanceRecords = await attendanceRes.json();

    // Create a map of attendance records for quick lookup
    const today = new Date().toISOString().split('T')[0];
    const attendanceMap = {};
    
    attendanceRecords.forEach(record => {
      const recordDate = new Date(record.attendanceDate).toISOString().split('T')[0];
      if (recordDate === today) {
        attendanceMap[record.studentNo] = record;
      }
    });

    tableBody.innerHTML = "";
    cardsContainer.innerHTML = "";

    // Display all enrolled students
    enrolledStudents.forEach(student => {
      const attendance = attendanceMap[student.studentNo];
      const status = attendance ? attendance.status : 'Absent';
      const time = attendance 
        ? new Date(attendance.attendanceDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        : '-';

      // Table row
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="flex"><div class="avatar"></div>${student.firstName} ${student.lastName}</td>
        <td>${student.studentNo}</td>
        <td>${student.moduleName || '-'}</td>
        <td>${time}</td>
        <td><span class="status ${status.toLowerCase()}">${status}</span></td>
      `;
      tableBody.appendChild(tr);

      // Mobile card
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="flex">
          <div class="avatar"></div>
          <div>
            <strong>${student.firstName} ${student.lastName}</strong>
            <div class="muted">ID: ${student.studentNo}</div>
          </div>
        </div>
        <div>Class: ${student.moduleName || '-'}</div>
        <div>Time: ${time}</div>
        <div><span class="status ${status.toLowerCase()}">${status}</span></div>
      `;
      cardsContainer.appendChild(card);
    });

    updateAttendanceStats(enrolledStudents, attendanceRecords.filter(r => {
      const recordDate = new Date(r.attendanceDate).toISOString().split('T')[0];
      return recordDate === today;
    }));
    
    document.querySelector('.panel-header .muted').textContent = 
      `Showing ${enrolledStudents.length} students`;
      
  } catch (err) {
    console.error("Error fetching attendance:", err);
  }
}

// Sidebar Date + Time updater
function updateDateTime() {
  const dateElem = document.getElementById('todayDate');
  if (!dateElem) return;

  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  dateElem.innerHTML = `${date} <br><span class="muted" style="font-size:0.9em;">${time}</span>`;
}

// Initialize everything
loadRecentAttendance();
updateDateTime();
setInterval(updateDateTime, 1000);