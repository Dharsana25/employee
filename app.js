let employees = [];
let editIndex = null;  //no value and get value later
let deleteIndex = null; // for single deletion
let deleteMode = ""; // "single" or "multiple"
fetch("employees.json")
  .then(res => res.json())  //recives parse to js object or array
  .then(data => {
    employees = data;
    renderList(employees);
  });
function renderList(data) {
  const databody = document.getElementById("data-body");
  databody.innerHTML = "";   
  for (let i = 0; i < data.length; i++) {
    const emp = data[i];

    const row = document.createElement("tr");

    const tdCheckbox = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "rowCheckbox";
    checkbox.setAttribute("data-index", i);
    tdCheckbox.appendChild(checkbox);
    row.appendChild(tdCheckbox);

    const tdId = document.createElement("td");
    tdId.textContent = emp.id;
    row.appendChild(tdId);
    function viewEmployeeDetails(index) {
      viewRow(index);
    }

    const tdName = document.createElement("td");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = emp.name;
    nameSpan.className = "name-link";
    nameSpan.addEventListener("click", function () {
      viewEmployeeDetails(i);
    });
    tdName.appendChild(nameSpan);
    row.appendChild(tdName);

    const tdDes = document.createElement("td");
    tdDes.textContent = emp.des;
    row.appendChild(tdDes);

    const tdDept = document.createElement("td");
    tdDept.textContent = emp.dept;
    row.appendChild(tdDept);

    const tdEmail = document.createElement("td");
    tdEmail.textContent = emp.email;
    row.appendChild(tdEmail);

    const tdActions = document.createElement("td");
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Edit";
    btnEdit.className = "edit";
    btnEdit.onclick = function () {
      editRow(i);
    };

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Delete";
    btnDelete.className = "delete";
    btnDelete.onclick = function () {
      deleteRow(i);
    };

    tdActions.appendChild(btnEdit);
    tdActions.appendChild(btnDelete);

    row.appendChild(tdActions);
    databody.appendChild(row);

  }
}

function showConfirmBox(mode, index = null) {
  deleteMode = mode;
  deleteIndex = index;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("confirm-Box").style.display = "block";
}
document.getElementById("delete-Selected").addEventListener("click", function () {
  const selected = document.querySelectorAll(".rowCheckbox:checked");
  if (selected.length === 0) {
    document.getElementById("message-Overlay").style.display = "block";
    document.getElementById("message-Box").style.display = "block";
    return;
  }
  showConfirmBox("multiple");
});
function closeMessage() {
  document.getElementById("message-Overlay").style.display = "none";
  document.getElementById("message-Box").style.display = "none";
}

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("rowCheckbox")) {
    closeMessage();
  }
});

// Single Delete button click
function deleteRow(index) {
  showConfirmBox("single", index);
}

// Yes Button
document.getElementById("yes").addEventListener("click", function () {
  if (deleteMode === "single" && deleteIndex !== null) {
    employees.splice(deleteIndex, 1);   //delete single row
  } else if (deleteMode === "multiple") {   //delete multiple row
    const selected = document.querySelectorAll(".rowCheckbox:checked");
    const indexes = Array.from(selected).map(cb => parseInt(cb.dataset.index));  //it is nodeleist convert into array object
    indexes.sort((a, b) => b - a);
    indexes.forEach(i => employees.splice(i, 1));  //delett the value using index
  }
  renderList(employees);
  document.getElementById("confirm-Box").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});

// No Button
document.getElementById("cancel").addEventListener("click", function () {
  document.getElementById("confirm-Box").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});
// Select All Checkbox Logic
document.getElementById("select-All").addEventListener("change", function () {
  const isChecked = this.checked;
  document.querySelectorAll(".rowCheckbox").forEach(cb => {
    cb.checked = isChecked;
  });
});
// Add new
document.getElementById("btn").addEventListener("click", function () {
  clearForm();
  editIndex = null;
  document.getElementById("input").style.display = "block";
});
document.getElementById("cancel-btn").addEventListener("click", function () {
  document.getElementById("input").style.display = "none";
});

// Submit (Add or Update)
document.getElementById("emp-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const idInput = document.getElementById("emp-id");
  const nameInput = document.getElementById("emp-name");
  const desInput = document.getElementById("emp-des");
  const deptInput = document.getElementById("emp-dept");
  const emailInput = document.getElementById("emp-email");

  const id_Error = document.getElementById("id_Error");
  const name_Error = document.getElementById("name_Error");
  const des_Error = document.getElementById("des_Error");
  const dept_Error = document.getElementById("dept_Error");
  const email_Error = document.getElementById("email_Error");

  const id = idInput.value.trim();
  const name = nameInput.value.trim();
  const des = desInput.value.trim();
  const dept = deptInput.value.trim();
  const email = emailInput.value.trim();

  let isValid = true;

  // if emty stores error msg filled clear the error
  id_Error.textContent = "";
  name_Error.textContent = "";
  des_Error.textContent = "";
  dept_Error.textContent = "";
  email_Error.textContent = "";

  if (id === "") {
    id_Error.textContent = "ID is required";
    isValid = false;
  }
  if (name === "") {
    name_Error.textContent = "Name is required";
    isValid = false;
  }
  if (des === "") {
    des_Error.textContent = "Description is required";
    isValid = false;
  }
  if (dept === "") {
    dept_Error.textContent = "Department is required";
    isValid = false;
  }
  if (email.trim() === "") {
    email_Error.textContent = "Email is required";
    isValid = false;
  } else if (!email.includes("@") || !email.includes(".")) {  //two condition become true it will work
    email_Error.textContent = "Enter a valid email address";
    isValid = false;
  }
  if (isValid) {  //after all validation become true it works dor displaying
    const emp = { id, name, des, dept, email };

    if (editIndex !== null) {
      employees[editIndex] = emp;  //edit employee
      editIndex = null;  //add new employee
    } else {
      employees.push(emp);  //push new employee
    }

    renderList(employees);  // list updated employee
    clearForm();
    document.getElementById("input").style.display = "none";
  }
});
// Event listeners to clear errors as the user types
document.getElementById("emp-id").addEventListener("input", function () {
  document.getElementById("id_Error").textContent = "";
});
document.getElementById("emp-name").addEventListener("input", function () {
  document.getElementById("name_Error").textContent = "";
});
document.getElementById("emp-des").addEventListener("input", function () {
  document.getElementById("des_Error").textContent = "";
});
document.getElementById("emp-dept").addEventListener("input", function () {
  document.getElementById("dept_Error").textContent = "";
});
document.getElementById("emp-email").addEventListener("input", function () {
  document.getElementById("email_Error").textContent = "";
});
document.getElementById("cancel-btn").addEventListener("click", function () {
  clearForm();
  editIndex = null;
  // Also clear errors on cancel
  document.getElementById("id_Error").textContent = "";
  document.getElementById("name_Error").textContent = "";
  document.getElementById("des_Error").textContent = "";
  document.getElementById("dept_Error").textContent = "";
  document.getElementById("email_Error").textContent = "";
  document.getElementById("input").style.display = "none";
});
function closePanel() {
  const box = document.getElementById("message-box");
  box.style.display = "none";
}
function viewRow(index) {
  const emp = employees[index];
  document.getElementById("view-Id").textContent = emp.id;
  document.getElementById("view-Name").textContent = emp.name;
  document.getElementById("view-Des").textContent = emp.des;
  document.getElementById("view-Dept").textContent = emp.dept;
  document.getElementById("view-Email").textContent = emp.email;
  document.getElementById("side-Panel").classList.add("show");
}
// Function to close the side panel
function closeSidePanel() {
  document.getElementById("side-Panel").classList.remove("show");
}
function editRow(index) {
  const emp = employees[index];  //edit in index value
  editIndex = index;  //stores in global variable 
  document.getElementById("emp-id").value = emp.id;
  document.getElementById("emp-name").value = emp.name;
  document.getElementById("emp-des").value = emp.des;
  document.getElementById("emp-dept").value = emp.dept;
  document.getElementById("emp-email").value = emp.email;
  document.getElementById("input").style.display = "block";
}
// Search (Debounced)
function debounce(func, delay) {
  let timer;   //stores settimeout reference
  return function (...args) {  //collect arugument pased to array
    clearTimeout(timer);   //clear the previous timer
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
const debouncedSearch = debounce(searchItems, 300);
document.getElementById("search").addEventListener("input", function (event) {
  debouncedSearch(event.target.value);
});
function searchItems() {
  const query = document.getElementById("search").value.toLowerCase();
  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(query.toLowerCase())
  );
  renderList(filtered);
}
// clears the previous view and edit to add new details
function clearForm() {
  document.getElementById("emp-id").value = "";
  document.getElementById("emp-name").value = "";
  document.getElementById("emp-des").value = "";
  document.getElementById("emp-dept").value = "";
  document.getElementById("emp-email").value = "";

  document.getElementById("id_Error").textContent = "";
  document.getElementById("name_Error").textContent = "";
  document.getElementById("des_Error").textContent = "";
  document.getElementById("dept_Error").textContent = "";
  document.getElementById("email_Error").textContent = "";
}


