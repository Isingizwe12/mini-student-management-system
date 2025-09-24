const studentForm = document.querySelector("[data-hook='student-form']");
const tbody = document.querySelector("tbody");

// Main object to manage students
const StudentManager = {
  students: JSON.parse(localStorage.getItem("students")) || [],

  // Auto-generate ID
  getNextId() {
    if (this.students.length === 0) return 1;
    return Math.max(...this.students.map(s => Number(s.id))) + 1;
  },

  // Add new student
  addStudent({ name, age, email, grades }) {
    const id = String(this.getNextId()).padStart(3, "0");
    const gradesArray = grades.split(",").map(g => Number(g.trim()));
    const average = (gradesArray.reduce((a,b)=>a+b,0) / gradesArray.length).toFixed(1);

    const student = { id, name, age, email, grades: gradesArray, average };
    this.students.push(student);
    this.save();
    this.renderTable();
  },

  // Delete student by ID
  deleteStudent(id) {
    this.students = this.students.filter(s => s.id !== id);
    this.save();
    this.renderTable();
  },

  // Save to localStorage
  save() {
    localStorage.setItem("students", JSON.stringify(this.students));
  },

  // Render table rows
  renderTable() {
    tbody.innerHTML = "";
    this.students.forEach(student => {
      const row = document.createElement("tr");
      row.className = "border-t";
      row.dataset.id = student.id;
      row.innerHTML = `
        <td class="px-4 py-3">${student.id}</td>
        <td class="px-4 py-3">${student.name}</td>
        <td class="px-4 py-3">${student.age}</td>
        <td class="px-4 py-3">${student.email}</td>
        <td class="px-4 py-3">[${student.grades.join(", ")}]</td>
        <td class="px-4 py-3">${student.average}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button class="text-sm px-2 py-1 border rounded" data-hook="view">View</button>
            <button class="text-sm px-2 py-1 border rounded" data-hook="edit">Edit</button>
            <button class="text-sm px-2 py-1 border rounded text-red-600" data-hook="delete">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
};

// Initial render
StudentManager.renderTable();

// Handle form submit
studentForm.addEventListener("submit", function(e){
  e.preventDefault();
  const name = studentForm.name.value;
  const age = studentForm.age.value;
  const email = studentForm.email.value;
  const grades = studentForm.grades.value;

  StudentManager.addStudent({ name, age, email, grades });
  studentForm.reset();
});

// Handle delete button using event delegation
tbody.addEventListener("click", function(e){
  if(e.target.dataset.hook === "delete"){
    const row = e.target.closest("tr");
    StudentManager.deleteStudent(row.dataset.id);
  }
});
