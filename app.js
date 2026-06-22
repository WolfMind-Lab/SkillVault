let courses = JSON.parse(localStorage.getItem("courses")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];
let files = JSON.parse(localStorage.getItem("files")) || [];

// SALVA CORSO
function addCourse() {
    let name = document.getElementById("courseName").value;
    let total = document.getElementById("hoursTotal").value;
    let done = document.getElementById("hoursDone").value;

    if (!name) return alert("Inserisci nome corso");

    let course = {
        name,
        total: parseInt(total),
        done: parseInt(done),
        missing: parseInt(total) - parseInt(done)
    };

    courses.push(course);
    localStorage.setItem("courses", JSON.stringify(courses));

    renderCourses();
}

// MOSTRA CORSI
function renderCourses() {
    let list = document.getElementById("courseList");
    list.innerHTML = "";

    courses.forEach((c, i) => {
        list.innerHTML += `
        <div class="course">
            <b>${c.name}</b><br>
            Ore totali: ${c.total}<br>
            Frequentate: ${c.done}<br>
            Mancanti: ${c.missing}
        </div>`;
    });
}

// EVENTI CALENDARIO
function addEvent() {
    let text = document.getElementById("eventText").value;
    if (!text) return;

    events.push(text);
    localStorage.setItem("events", JSON.stringify(events));

    renderEvents();
}

function renderEvents() {
    let list = document.getElementById("eventList");
    list.innerHTML = "";

    events.forEach(e => {
        list.innerHTML += `<div class="event">📌 ${e}</div>`;
    });
}

// UPLOAD FILE (SIMULAZIONE SCANNER)
function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];

    if (!file) return;

    files.push(file.name);
    localStorage.setItem("files", JSON.stringify(files));

    renderFiles();
}

function renderFiles() {
    let list = document.getElementById("fileList");
    list.innerHTML = "";

    files.forEach(f => {
        list.innerHTML += `<div class="event">📄 ${f}</div>`;
    });
}

// INIT
renderCourses();
renderEvents();
renderFiles();