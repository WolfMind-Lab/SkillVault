let courses = JSON.parse(localStorage.getItem("courses")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];
let files = JSON.parse(localStorage.getItem("files")) || [];

/* NAVIGATION */
function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    renderAll();
}

/* COURSES */
function addCourse() {
    let name = document.getElementById("courseName").value;
    let total = Number(document.getElementById("hoursTotal").value);
    let done = Number(document.getElementById("hoursDone").value);

    if (!name) return;

    courses.push({ name, total, done });
    save();
    renderCourses();
    renderDashboard();
}

function renderCourses() {
    let box = document.getElementById("courseList");
    box.innerHTML = "";

    courses.forEach(c => {
        box.innerHTML += `
        <div class="item">
            <b>${c.name}</b><br>
            Ore: ${c.done}/${c.total}
        </div>`;
    });
}

/* EVENTS */
function addEvent() {
    let text = document.getElementById("eventText").value;
    if (!text) return;

    events.push(text);
    save();
    renderEvents();
}

function renderEvents() {
    let box = document.getElementById("eventList");
    if (!box) return;

    box.innerHTML = "";
    events.forEach(e => {
        box.innerHTML += `<div class="item">📅 ${e}</div>`;
    });
}

/* FILES */
function uploadFile() {
    let file = document.getElementById("fileInput").files[0];
    if (!file) return;

    files.push(file.name);
    save();
    renderFiles();
}

function renderFiles() {
    let box = document.getElementById("fileList");
    box.innerHTML = "";

    files.forEach(f => {
        box.innerHTML += `<div class="item">📄 ${f}</div>`;
    });
}

/* DASHBOARD */
function renderDashboard() {
    let totalCourses = courses.length;
    let totalHours = courses.reduce((a, c) => a + c.total, 0);
    let doneHours = courses.reduce((a, c) => a + c.done, 0);

    document.getElementById("stats").innerHTML = `
        <div class="item">🎓 Corsi: ${totalCourses}</div>
        <div class="item">⏱ Ore totali: ${totalHours}</div>
        <div class="item">✅ Ore frequentate: ${doneHours}</div>
    `;
}

/* SAVE */
function save() {
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("files", JSON.stringify(files));
}

/* INIT */
function renderAll() {
    renderCourses();
    renderEvents();
    renderFiles();
    renderDashboard();
}

renderAll();