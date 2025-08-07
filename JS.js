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
  const databody = document.getElementById("databody");
  databody.innerHTML = "";   //remove the duplication

  data.forEach((emp, index) => {  //loops every element
    const row = document.createElement("tr");   //for every element it creates table

    row.innerHTML = `
    <td><input type="checkbox" class="rowCheckbox" data-index="${index}" /></td>
      <td>${emp.id}</td>
      <td><span class="name-link">${emp.name}</span></td>
      <td>${emp.des}</td>
      <td>${emp.dept}</td>
      <td>${emp.email}</td>
       <td class="action-buttons">
      <button class="view" onclick="viewRow(${index})">View</button>
    <button class="edit" onclick="editRow(${index})">Edit</button>
    <button class="delete" onclick="deleteRow(${index})">Delete</button>
      </td>
    `;

    databody.appendChild(row);
  });
}
function showConfirmBox(mode, index = null) {
  deleteMode = mode;
  deleteIndex = index;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("confirmBox").style.display = "block";
}
document.getElementById("deleteSelected").addEventListener("click", function () {
  const selected = document.querySelectorAll(".rowCheckbox:checked");
  if (selected.length === 0) {
    document.getElementById("messageOverlay").style.display = "block";
    document.getElementById("messageBox").style.display = "block";
    return;
  }
  showConfirmBox("multiple");
});
function closeMessage() {
  document.getElementById("messageOverlay").style.display = "none";
  document.getElementById("messageBox").style.display = "none";
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
  document.getElementById("confirmBox").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});

// No Button
document.getElementById("cancel").addEventListener("click", function () {
  document.getElementById("confirmBox").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});

// Select All Checkbox Logic
document.getElementById("selectAll").addEventListener("change", function () {
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
document.getElementById("cancelbtn").addEventListener("click", function () {
  document.getElementById("input").style.display = "none";
});

// Submit (Add or Update)
document.getElementById("empform").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission

  const idInput = document.getElementById("empid");
  const nameInput = document.getElementById("empname");
  const desInput = document.getElementById("empdes");
  const deptInput = document.getElementById("empdept");
  const emailInput = document.getElementById("empemail");

  const idError = document.getElementById("idError");
  const nameError = document.getElementById("nameError");
  const desError = document.getElementById("desError");
  const deptError = document.getElementById("deptError");
  const emailError = document.getElementById("emailError");

  const id = idInput.value.trim();
  const name = nameInput.value.trim();
  const des = desInput.value.trim();
  const dept = deptInput.value.trim();
  const email = emailInput.value.trim();

  let isValid = true;

  // if emty stores error msg filled clear the error
  idError.textContent = "";
  nameError.textContent = "";
  desError.textContent = "";
  deptError.textContent = "";
  emailError.textContent = "";

  if (id === "") {
    idError.textContent = "ID is required";
    isValid = false;
  }
  if (name === "") {
    nameError.textContent = "Name is required";
    isValid = false;
  }
  if (des === "") {
    desError.textContent = "Description is required";
    isValid = false;
  }
  if (dept === "") {
    deptError.textContent = "Department is required";
    isValid = false;
  }
  if (email.trim() === "") {
    emailError.textContent = "Email is required";
    isValid = false;
  } else if (!email.includes("@") || !email.includes(".")) {  //two condition become true it will work
    emailError.textContent = "Enter a valid email address";
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
document.getElementById("empid").addEventListener("input", function () {
  document.getElementById("idError").textContent = "";
});
document.getElementById("empname").addEventListener("input", function () {
  document.getElementById("nameError").textContent = "";
});
document.getElementById("empdes").addEventListener("input", function () {
  document.getElementById("desError").textContent = "";
});
document.getElementById("empdept").addEventListener("input", function () {
  document.getElementById("deptError").textContent = "";
});
document.getElementById("empemail").addEventListener("input", function () {
  document.getElementById("emailError").textContent = "";
});


document.getElementById("cancelbtn").addEventListener("click", function () {
  clearForm();
  editIndex = null;
  // Also clear errors on cancel
  document.getElementById("idError").textContent = "";
  document.getElementById("nameError").textContent = "";
  document.getElementById("desError").textContent = "";
  document.getElementById("deptError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("input").style.display = "none";
});
function closePanel() {
  const box = document.getElementById("messagebox");
  box.style.display = "none";
}
function viewRow(index) {
  const emp = employees[index];
  document.getElementById("viewId").textContent = emp.id;
  document.getElementById("viewName").textContent = emp.name;
  document.getElementById("viewDes").textContent = emp.des;
  document.getElementById("viewDept").textContent = emp.dept;
  document.getElementById("viewEmail").textContent = emp.email;
  document.getElementById("sidePanel").classList.add("show");
}


// Function to close the side panel
function closeSidePanel() {
  document.getElementById("sidePanel").classList.remove("show");
}

function editRow(index) {
  const emp = employees[index];  //edit in index value
  editIndex = index;  //stores in global variable 
  document.getElementById("empid").value = emp.id;
  document.getElementById("empname").value = emp.name;

  document.getElementById("empdes").value = emp.des;
  document.getElementById("empdept").value = emp.dept;
  document.getElementById("empemail").value = emp.email;
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
  document.getElementById("empid").value = "";
  document.getElementById("empname").value = "";
  document.getElementById("empdes").value = "";
  document.getElementById("empdept").value = "";
  document.getElementById("empemail").value = "";

  document.getElementById("idError").textContent = "";
  document.getElementById("nameError").textContent = "";
  document.getElementById("desError").textContent = "";
  document.getElementById("deptError").textContent = "";
  document.getElementById("emailError").textContent = "";
}
