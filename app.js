let profile = JSON.parse(localStorage.getItem("profile")) || {};
let paths = JSON.parse(localStorage.getItem("paths")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];
let calendar = JSON.parse(localStorage.getItem("calendar")) || [];

/* =========================
   PROFILO
========================= */
function saveProfile() {
  profile = {
    name: document.getElementById("userName").value,
    goal: document.getElementById("userGoal").value
  };

  save();
  renderAll();
}

function renderProfile() {
  const box = document.getElementById("profile");

  box.innerHTML = `
    <div class="item">
      👤 ${profile.name || "N/A"}<br>
      🎯 ${profile.goal || "Nessun obiettivo"}
    </div>
  `;
}

/* =========================
   PERCORSI
========================= */
function addPath() {
  const name = document.getElementById("pathName").value;
  const type = document.getElementById("educationType").value;

  if (!name) return;

  paths.push({
    name,
    type,
    courses: []
  });

  save();
  renderAll();
}

/* =========================
   CORSI
========================= */
function addCourse() {
  const pathId = document.getElementById("pathSelect").value;
  const name = document.getElementById("courseName").value;
  const total = Number(document.getElementById("totalHours").value);
  const tol = Number(document.getElementById("tolerance").value);

  if (!paths[pathId] || !name || total <= 0) return;

  paths[pathId].courses.push({
    name,
    totalHours: total,
    doneHours: 0,
    absentHours: 0,
    tolerance: tol
  });

  save();
  renderAll();
}

/* =========================
   REGISTRO
========================= */
function addLog(type) {
  const p = document.getElementById("pathSelect").value;
  const c = document.getElementById("courseSelect").value;
  const h = Number(document.getElementById("hours").value);

  const course = paths[p]?.courses[c];
  if (!course || h <= 0) return;

  if (type === "present") course.doneHours += h;
  else course.absentHours += h;

  logs.push({
    date: new Date().toLocaleDateString(),
    type,
    h,
    p,
    c
  });

  save();
  renderAll();
}

/* =========================
   CALENDARIO (LEGATO AI CORSI)
========================= */
function addEvent() {
  const p = document.getElementById("pathSelect").value;
  const c = document.getElementById("courseSelect").value;
  const text = document.getElementById("eventText").value;

  const course = paths[p]?.courses[c];
  if (!course || !text) return;

  if (!course.calendar) course.calendar = [];

  course.calendar.push({
    text,
    date: new Date().toLocaleDateString()
  });

  save();
  renderCalendar();
}

function renderCalendar() {
  const p = document.getElementById("pathSelect").value;
  const c = document.getElementById("courseSelect").value;

  const box = document.getElementById("calendar");
  if (!box) return;

  box.innerHTML = "";

  const course = paths[p]?.courses[c];
  const list = course?.calendar || [];

  list.forEach(e => {
    box.innerHTML += `
      <div class="item">
        📅 ${e.date}<br>
        📘 ${course.name}<br>
        ${e.text}
      </div>
    `;
  });
}

/* =========================
   CV AUTOMATICO (DINAMICO)
========================= */
function generateCV() {
  const cv = document.getElementById("cv");

  let html = `
    <div class="item">
      <h3>📄 Curriculum Vitae</h3>
      👤 ${profile.name || ""}<br>
      🎯 ${profile.goal || ""}<br><br>
  `;

  paths.forEach(p => {
    html += `<b>${p.type} - ${p.name}</b><br>`;

    p.courses.forEach(c => {
      html += `
        • ${c.name}<br>
        └ ${c.doneHours}/${c.totalHours}h - ${c.absentHours} assenze<br>
      `;
    });

    html += "<br>";
  });

  html += "</div>";

  cv.innerHTML = html;
}

/* =========================
   PORTFOLIO DINAMICO
========================= */
function renderPortfolio() {
  const box = document.getElementById("portfolio");

  let courses = 0;
  let hours = 0;

  paths.forEach(p => {
    courses += p.courses.length;

    p.courses.forEach(c => {
      hours += c.doneHours;
    });
  });

  box.innerHTML = `
    <div class="item">
      💼 <b>Portfolio professionale</b><br><br>
      🎓 Percorsi: ${paths.length}<br>
      📚 Corsi: ${courses}<br>
      ⏱ Ore completate: ${hours}
    </div>
  `;
}

/* =========================
   SELECT SINCRONIZZATI
========================= */
function renderPaths() {
  const box = document.getElementById("paths");
  const select = document.getElementById("pathSelect");

  box.innerHTML = "";
  select.innerHTML = "";

  paths.forEach((p, i) => {

    select.innerHTML += `<option value="${i}">${p.name}</option>`;

    box.innerHTML += `
      <div class="item">
        🎓 ${p.type} - ${p.name}
      </div>
    `;
  });

  renderCourses();
  renderCalendar();
}

function renderCourses() {
  const p = document.getElementById("pathSelect").value;
  const select = document.getElementById("courseSelect");
  const box = document.getElementById("courses");

  select.innerHTML = "";
  box.innerHTML = "";

  const list = paths[p]?.courses || [];

  list.forEach((c, i) => {

    select.innerHTML += `<option value="${i}">${c.name}</option>`;

    const maxAbs = c.totalHours * (c.tolerance / 100);

    box.innerHTML += `
      <div class="item">
        📘 ${c.name}<br>
        ✅ ${c.doneHours}h / ${c.totalHours}h<br>
        ❌ Assenze: ${c.absentHours}<br>
        ⚖️ Tolleranza: ${c.tolerance}% (${maxAbs}h)
      </div>
    `;
  });

  renderCalendar();
}

/* =========================
   LOGS
========================= */
function renderLogs() {
  const box = document.getElementById("logs");

  box.innerHTML = "";

  logs.slice().reverse().forEach(l => {
    const c = paths[l.p]?.courses[l.c];

    box.innerHTML += `
      <div class="item">
        📅 ${l.date} - ${c?.name || ""}<br>
        ${l.type === "present" ? "✔" : "❌"} ${l.h}h
      </div>
    `;
  });
}

/* =========================
   SAVE + INIT
========================= */
function save() {
  localStorage.setItem("profile", JSON.stringify(profile));
  localStorage.setItem("paths", JSON.stringify(paths));
  localStorage.setItem("logs", JSON.stringify(logs));
  localStorage.setItem("calendar", JSON.stringify(calendar));
}

function renderAll() {
  renderProfile();
  renderPaths();
  renderCourses();
  renderLogs();
  renderPortfolio();
  renderCalendar();
}

renderAll();