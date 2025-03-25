document.addEventListener("DOMContentLoaded", function () {
  populateDateSelectors();
  populateViewSelectors();
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function populateDateSelectors() {
  const yearSelect = document.getElementById("year-select");
  const monthSelect = document.getElementById("month-select");
  const daySelect = document.getElementById("day-select");

  for (let y = 2020; y <= 2030; y++) {
    let option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }

  months.forEach((month, index) => {
    let option = document.createElement("option");
    option.value = index + 1;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  for (let d = 1; d <= 31; d++) {
    let option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    daySelect.appendChild(option);
  }
}

function populateViewSelectors() {
  document.getElementById("view-year-select").innerHTML =
    document.getElementById("year-select").innerHTML;
  document.getElementById("view-month-select").innerHTML =
    document.getElementById("month-select").innerHTML;
  document.getElementById("view-day-select").innerHTML =
    document.getElementById("day-select").innerHTML;
}

function getSelectedDateId(isView = false) {
  let year = document.getElementById(
    isView ? "view-year-select" : "year-select"
  ).value;
  let month = document.getElementById(
    isView ? "view-month-select" : "month-select"
  ).value;
  let day = document.getElementById(
    isView ? "view-day-select" : "day-select"
  ).value;
  return `${year}-${month}-${day}`;
}

function saveEntry() {
  let dateId = getSelectedDateId();
  let text = document.getElementById("diary-text").value;

  if (!text) {
    alert("Please write something before saving!");
    return;
  }

  localStorage.setItem(dateId, text);
  document.getElementById("success-message").style.display = "block";
  setTimeout(() => {
    document.getElementById("success-message").style.display = "none";
  }, 3000);
}

function viewEntry() {
  let dateId = getSelectedDateId(true);
  let entryText =
    localStorage.getItem(dateId) || "No entry found for this date.";
  document.getElementById("entry-display").innerHTML = `
        <p>${entryText}</p>
        <button onclick="editEntry('${dateId}')">Edit</button>
        <button onclick="deleteEntry('${dateId}')">Delete</button>
    `;
}

function editEntry(dateId) {
  let newText = prompt("Edit your entry:", localStorage.getItem(dateId));
  if (newText !== null) {
    localStorage.setItem(dateId, newText);
    alert("Entry updated!");
    viewEntry();
    viewMonthEntries();
  }
}

function deleteEntry(dateId) {
  if (confirm("Are you sure you want to delete this entry?")) {
    localStorage.removeItem(dateId);
    alert("Entry deleted!");
    document.getElementById("entry-display").innerHTML = "";
    viewMonthEntries();
  }
}

function viewMonthEntries() {
  let year = document.getElementById("view-year-select").value;
  let month = document.getElementById("view-month-select").value;
  let tableBody = document.querySelector("#month-data-table tbody");
  tableBody.innerHTML = "";

  let found = false;
  for (let d = 1; d <= 31; d++) {
    let dateId = `${year}-${month}-${d}`;
    let entry = localStorage.getItem(dateId);

    if (entry) {
      found = true;
      let row = document.createElement("tr");
      row.innerHTML = `
                <td>${months[month - 1]} ${d}, ${year}</td>
                <td>${entry}</td>
                <td>
                    <button onclick="editEntry('${dateId}')">Edit</button>
                    <button onclick="deleteEntry('${dateId}')">Delete</button>
                </td>
            `;
      tableBody.appendChild(row);
    }
  }

  if (!found) {
    tableBody.innerHTML =
      "<tr><td colspan='3'>No entries for this month.</td></tr>";
  }
}
