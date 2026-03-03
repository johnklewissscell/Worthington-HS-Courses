const spreadsheetId = "1LwoemJFPBU4hhMN7NiGtePmeTubJV3-mV4Bwd-AJE5U";
const apiKey = "AIzaSyC7Uu9rdWTKJjexO7QARH9R_ZIiVJxJb_c";
const contentDiv = document.getElementById("content");
const schoolSelect = document.getElementById("high-school");
const gradeSelect = document.getElementById("grade-level");
const subjectSelect = document.getElementById("subject");
const searchInput = document.querySelector(".form__field");

const subjects = [
  "English",
  "Math",
  "Science",
  "Social Studies",
  "Wrld Languages",
  "Fine Arts",
  "Perf. Arts",
  "Health & PE",
  "Tech & Engr",
  "FCS",
  "Business"
];

let courses = [];

async function fetchSheet(subject) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(subject)}?key=${apiKey}`;
  
  const res = await fetch(url);
  const data = await res.json();

  const rows = data.values.slice(1); 

  return rows.map(row => ({
    school: row[9],
    grade: row[1],
    name: row[0],
    length: row[2],
    credits: row[3],
    stateTested: row[4],
    gradCredit: row[5],
    prerequisites: row[6],
    grading: row[7],
    description: row[8],
    subject: subject
  }));
}

async function loadAllCourses() {
  const results = await Promise.all(subjects.map(fetchSheet));
  courses = results.flat();
  renderCourses(courses);
}

loadAllCourses();
function filterCourses() {
  const school = schoolSelect.value === "blank" ? "Both" : schoolSelect.value;
  const grade = gradeSelect.value === "blank" ? "A" : gradeSelect.value;
  const subject = subjectSelect.value === "blank" ? "All" : subjectSelect.value;
  const search = searchInput.value.toLowerCase();

  const filtered = courses.filter(course => {
    const nameMatch = course.name.toLowerCase().includes(search);

    let schoolMatch = false;
    if (school === "Both") {
      schoolMatch = true; 
    } else if (school === "TWHS") {
      schoolMatch = course.school === "TWHS" || course.school === "Both";
    } else if (school === "WKHS") {
      schoolMatch = course.school === "WKHS" || course.school === "Both";
    }


    const gradeMatch = grade === "A" || course.grade.includes(grade);
    const subjectMatch =
      subject === "All" ||
      course.subject.toLowerCase().includes(subject.toLowerCase());

    return nameMatch && schoolMatch && gradeMatch && subjectMatch;
  });

  renderCourses(filtered);
}
const clearBtn = document.getElementById("clear-filters");

clearBtn.addEventListener("click", () => {
  schoolSelect.value = "blank";
  gradeSelect.value = "blank";
  subjectSelect.value = "blank";
  searchInput.value = "";
  filterCourses();
});
function renderCourses(courseArray) {
  contentDiv.innerHTML = "";

  if (courseArray.length === 0) {
    contentDiv.innerHTML = "<p style='color:white;'>No courses found.</p>";
    return;
  }

  courseArray.forEach(course => {
    const card = document.createElement("div");
    card.addEventListener("click", () => {
  if (contentDiv.classList.contains("grid-view")) {
    modalBody.innerHTML = `
      <h2 id="modal-title">${course.name}</h2>
      <div id="underbar"></div>
      <p><strong>School:</strong> ${course.school}</p>
      <p><strong>Grade Level:</strong> ${course.grade}</p>
      <p><strong>Subject:</strong> ${course.subject}</p>
      <p><strong>Length:</strong> ${course.length}</p>
      <p><strong>Credits:</strong> ${course.credits}</p>
      <p><strong>State Tested:</strong> ${course.stateTested}</p>
      <p><strong>Grad Credit:</strong> ${course.gradCredit}</p>
      <p><strong>Prerequisites:</strong> ${course.prerequisites}</p>
      <p><strong>Grading:</strong> ${course.grading}</p>
      <hr>
      <p>${course.description}</p>
    `;
    modal.style.display = "flex";
  }
});
    card.classList.add("course-card");
    card.id = "c";

    card.innerHTML = `
    <div class="name-dets">
      <div class="course-name">
        <h2>${course.name}</h2>
      </div>

      <div class="course-details">
    <div class="column-two">
        <p><strong>Length:</strong> ${course.length}</p>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <p><strong>State Tested:</strong> ${course.stateTested}</p>
    </div>
    <div class="column-three">
        <p><strong>Grad Credit:</strong> ${course.gradCredit}</p>
        <p><strong>Prerequisites:</strong> ${course.prerequisites}</p>
        <p><strong>Grading:</strong> ${course.grading}</p>
    </div>
      </div>
      </div>

      <div class="course-desc">
        <p>${course.description}</p>
      </div>
    `;

    contentDiv.appendChild(card);
  });
}

schoolSelect.addEventListener("change", filterCourses);
gradeSelect.addEventListener("change", filterCourses);
subjectSelect.addEventListener("change", filterCourses);
searchInput.addEventListener("input", filterCourses);

contentDiv.classList.add("list-view");
const gridBtn = document.getElementById("gridbtn");
const listBtn = document.getElementById("listbtn");

gridBtn.addEventListener("click", () => {
  contentDiv.classList.remove("list-view");
  contentDiv.classList.add("grid-view");
});

listBtn.addEventListener("click", () => {
  contentDiv.classList.remove("grid-view");
  contentDiv.classList.add("list-view");
});

//popup

const modal = document.getElementById("course-modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});