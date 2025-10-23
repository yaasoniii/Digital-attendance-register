document.addEventListener("DOMContentLoaded", () => {
  // ===== Tabs =====
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // ===== STUDENT MODAL =====
  const studentModal = document.getElementById("studentModal");
  const openStudentBtn = document.getElementById("addStudentBtn");
  const closeStudentBtn = document.getElementById("closeStudentModal");
  const cancelStudentBtn = document.getElementById("cancelStudentBtn");
  const studentForm = document.getElementById("studentForm");
  const studentTable = document.querySelector("#studentTable tbody");

  const studentIdInput = document.getElementById("studentId");
  const studentNameInput = document.getElementById("studentName");
  const studentSurnameInput = document.getElementById("studentSurname");
  const studentPinInput = document.getElementById("studentPin");
  const studentCourseInput = document.getElementById("studentCourse");

  const openModal = (modal) => modal.style.display = "flex";
  const closeModal = (modal) => modal.style.display = "none";

  // Open/close student modal
  openStudentBtn.addEventListener("click", () => {
    openModal(studentModal);
    studentForm.reset();
    clearAllErrors();
  });

  closeStudentBtn.addEventListener("click", () => closeModal(studentModal));
  cancelStudentBtn.addEventListener("click", () => closeModal(studentModal));
  window.addEventListener("click", e => { if(e.target === studentModal) closeModal(studentModal); });

  // ===== Student Error Handling =====
  function setError(input, message) {
    const errorSpan = document.getElementById(`${input.id}Error`);
    errorSpan.textContent = message;
    input.classList.add("incorrect");
  }

  function clearError(input) {
    const errorSpan = document.getElementById(`${input.id}Error`);
    errorSpan.textContent = "";
    input.classList.remove("incorrect");
  }

  function clearAllErrors() {
    [studentIdInput, studentNameInput, studentSurnameInput, studentPinInput, studentCourseInput].forEach(clearError);
  }

  [studentIdInput, studentNameInput, studentSurnameInput, studentPinInput, studentCourseInput].forEach(input => {
    input.addEventListener("input", () => clearError(input));
  });

  // ===== Student Form Submission =====
  studentForm.addEventListener("submit", async e => {
    e.preventDefault();
    clearAllErrors();

    let errors = [];
    const studentIdVal = studentIdInput.value.trim();
    const studentPinVal = studentPinInput.value.trim();

    if(!studentIdVal) setError(studentIdInput, "Student ID is required"), errors.push("studentId");
    else if(!/^\d+$/.test(studentIdVal)) setError(studentIdInput, "Student ID should be digits only"), errors.push("studentIdDigits");
    else if(studentIdVal.length !== 9) setError(studentIdInput, "Student ID should be 9 digits"), errors.push("studentIdLength");

    if(!studentNameInput.value.trim()) setError(studentNameInput, "First Name is required"), errors.push("studentName");
    if(!studentSurnameInput.value.trim()) setError(studentSurnameInput, "Last Name is required"), errors.push("studentSurname");

    if(!studentPinVal) setError(studentPinInput, "PIN is required"), errors.push("studentPin");
    else if(!/^\d{4}$/.test(studentPinVal)) setError(studentPinInput, "PIN must be 4 digits"), errors.push("studentPinInvalid");

    if(!studentCourseInput.value.trim()) setError(studentCourseInput, "Program Code is required"), errors.push("studentCourse");

    if(errors.length > 0) return;

    const formData = new FormData(studentForm);
    try {
      const res = await fetch("../php/addStudent.php", { method: "POST", body: formData });
      const data = await res.text();
      alert(data);
      closeModal(studentModal);
      studentForm.reset();
      loadStudents();
    } catch (err) {
      console.error("Error saving student:", err);
      alert("Something went wrong saving the student.");
    }
  });

  // ===== Load Students =====
  async function loadStudents() {
    try {
      const res = await fetch("../php/getStudentInfo.php");
      const students = await res.json();
      studentTable.innerHTML = "";
      students.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.student_id}</td>
          <td>${student.first_name} ${student.last_name}</td>
          <td>${student.course}</td>
          <td>
            <button onclick="editStudent(${student.id})">✏️</button>
            <button onclick="deleteStudent(${student.id})">🗑️</button>
          </td>
        `;
        studentTable.appendChild(row);
      });
      document.getElementById("studentCount").textContent = `Total Students: ${students.length}`;
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  }
  loadStudents();

  // ===== CLASS MODAL =====
  const classModal = document.getElementById("classModal");
  const openClassBtn = document.getElementById("addClassBtn");
  const closeClassBtn = document.getElementById("closeClassModal");
  const cancelClassBtn = document.getElementById("cancelClassBtn");
  const classForm = document.getElementById("classForm");
  const classTable = document.querySelector("#classTable tbody");

  // Open/close class modal
  openClassBtn.addEventListener("click", () => {
    openModal(classModal);
    classForm.reset();
  });

  closeClassBtn.addEventListener("click", () => closeModal(classModal));
  cancelClassBtn.addEventListener("click", () => closeModal(classModal));
  window.addEventListener("click", e => { if(e.target === classModal) closeModal(classModal); });

  // ===== Class Form Submission =====
  classForm.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(classForm);
    try {
      const res = await fetch("../php/addClass.php", { method: "POST", body: formData });
      const data = await res.json();
      
      if(data.error) {
        alert(data.error);
      } else {
        alert(data.success || 'Class added successfully');
        closeModal(classModal);
        classForm.reset();
        loadClasses();
      }
    } catch (err) {
      console.error("Error saving class:", err);
      alert("Something went wrong saving the class.");
    }
  });

  // ===== Load Classes =====
  async function loadClasses() {
    try {
      const res = await fetch("../php/getClasses.php");
      const classes = await res.json();
      classTable.innerHTML = "";
      classes.forEach(cls => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${cls.moduleCode}</td>
          <td>${cls.moduleName}</td>
          <td>${cls.totalSessions || '-'}</td>
          <td>${cls.instructor}</td>
          <td>${cls.dayOfWeek} ${cls.startTime.substring(0,5)}-${cls.endTime.substring(0,5)}</td>
          <td>${cls.room}</td>
          <td>
            <button onclick="editClass(${cls.classID})">✏️</button>
            <button onclick="deleteClass(${cls.classID})">🗑️</button>
          </td>
        `;
        classTable.appendChild(row);
      });
      document.getElementById("classCount").textContent = `Total Classes: ${classes.length}`;
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  }
  loadClasses();
});