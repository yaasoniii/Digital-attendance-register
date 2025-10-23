const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const navLinks = sidebar.querySelectorAll('nav a');

// Toggle sidebar
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show');
  overlay.classList.toggle('show');
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
function updateAttendanceStats() {
  const statusCells = document.querySelectorAll(".attendance-table tbody tr td span.status");

  let total = statusCells.length;
  let present = 0, absent = 0, late = 0;

  statusCells.forEach(cell => {
    if (cell.classList.contains("present")) present++;
    if (cell.classList.contains("absent")) absent++;
    if (cell.classList.contains("late")) late++;
  });

  document.getElementById("totalStudents").textContent = total;
  document.getElementById("presentStudents").textContent = present;
  document.getElementById("absentStudents").textContent = absent;
  document.getElementById("lateStudents").textContent = late;

  const percent = total > 0 ? Math.round((present / total) * 100) : 0;
  document.getElementById("presentPercent").textContent = `${percent}% attendance`;
}

// Run it on page load
updateAttendanceStats();

async function loadRecentAttendance() {
  const tableBody = document.querySelector(".attendance-table tbody");
  const cardsContainer = document.querySelector(".attendance-cards");

  try {
    const res = await fetch("../php/getAttendance.php");
    const attendance = await res.json();

    tableBody.innerHTML = "";
    cardsContainer.innerHTML = "";

    attendance.forEach(record => {
      // Table row
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="flex"><div class="avatar"></div>${record.firstName} ${record.lastName}</td>
        <td>${record.studentNo}</td>
        <td>-</td> <!-- no class info -->
        <td>${new Date(record.attendanceDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
        <td><span class="status ${record.status.toLowerCase()}">${record.status}</span></td>
      `;
      tableBody.appendChild(tr);

      // Mobile card
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="flex">
          <div class="avatar"></div>
          <div>
            <strong>${record.firstName} ${record.lastName}</strong>
            <div class="muted">ID: ${record.studentNo}</div>
          </div>
        </div>
        <div>Class: -</div>
        <div>Time: ${new Date(record.attendanceDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        <div><span class="status ${record.status.toLowerCase()}">${record.status}</span></div>
      `;
      cardsContainer.appendChild(card);
    });

    // Update stats
    updateAttendanceStats();
  } catch (err) {
    console.error("Error fetching attendance:", err);
  }
}

// Run on page load
loadRecentAttendance();

