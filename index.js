
  const form = document.querySelector("[data-hook='student-form']");
  const tbody = document.querySelector("tbody");

  // Get existing students from localStorage or start empty
  let students = JSON.parse(localStorage.getItem("students")) || [];

  // Determine studentCounter based on existing students
  let studentCounter = students.length > 0 
    ? Math.max(...students.map(s => Number(s.id))) + 1 
    : 1;

  // Function to render table rows
  function renderTable() {
    tbody.innerHTML = ""; // clear table
    students.forEach(student => {
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

  // Initial render on page load
  renderTable();

  // Add student
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = String(studentCounter).padStart(3, "0"); // 001, 002...
    studentCounter++;

    const name = form.name.value;
    const age = form.age.value;
    const email = form.email.value;
    const gradesInput = form.grades.value;
    const grades = gradesInput.split(",").map(num => Number(num.trim()));
    const average = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);

    // Add student to array
    const student = { id, name, age, email, grades, average };
    students.push(student);

    // Save to localStorage
    localStorage.setItem("students", JSON.stringify(students));

    // Re-render table
    renderTable();

    // Reset form
    form.reset();
  });

  // Delete student
  tbody.addEventListener("click", function(e) {
    if (e.target.dataset.hook === "delete") {
      const row = e.target.closest("tr");
      const studentId = row.dataset.id;

      // Remove from array
      students = students.filter(s => s.id !== studentId);

      // Update localStorage
      localStorage.setItem("students", JSON.stringify(students));

      // Re-render table
      renderTable();
    }
  });

