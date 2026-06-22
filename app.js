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

  localStorage.setItem("profile", JSON.stringify(profile));
  renderProfile();
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

  paths.push({ name, type, courses: [] });

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

  if (!paths[pathId] || !name) return;

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
   CALENDARIO
========================= */
function addEvent() {
  const text = document.getElementById("eventText").value;
  if (!text) return;

  calendar.push({
    text,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("calendar", JSON.stringify(calendar));
  renderCalendar();
}

function renderCalendar() {
  const box = document.getElementById("calendar");
  if (!box) return;

  box.innerHTML = "";

  calendar.forEach(e => {
    box.innerHTML += `
      <div class="item">
        📅 ${e.date} - ${e.text}
      </div>
    `;
  });
}

/* =========================
   CV AUTOMATICO
========================= */
function generateCV() {
  let html = `
    <div class="item">
      <h3>📄 Curriculum Vitae</h3>
      <b>${profile.name || ""}</b><br>
      Obiettivo: ${profile.goal || ""}<br><br>

      <b>Formazione:</b><br>
  `;

  paths.forEach(p => {
    html += `- ${p.type}: ${p.name}<br>`;
    p.courses.forEach(c => {
      html += `  • ${c.name} (${c.doneHours}/${c.totalHours}h)<br>`;
    });
  });

  html += "</div>";

  document.getElementById("cv").innerHTML = html;
}

/* =========================
   PORTFOLIO
========================= */
function renderPortfolio() {
  const box = document.getElementById("portfolio");

  let totalCourses = 0;
  let totalHours = 0;

  paths.forEach(p => {
    totalCourses += p.courses.length;
    p.courses.forEach(c => {
      totalHours += c.doneHours;
    });
  });

  box.innerHTML = `
    <div class="item">
      💼 <b>Portfolio professionale</b><br><br>
      📚 Percorsi: ${paths.length}<br>
      📘 Corsi: ${totalCourses}<br>
      ⏱ Ore completate: ${totalHours}
    </div>
  `;
}

/* =========================
   RENDER GENERALE
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
}

function renderCourses() {
  const p = document.getElementById("pathSelect").value;
  const box = document.getElementById("courses");

  box.innerHTML = "";

  const list = paths[p]?.courses || [];

  list.forEach(c => {

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
}

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
}

function renderAll() {
  renderProfile();
  renderPaths();
  renderCourses();
  renderLogs();
  renderCalendar();
  renderPortfolio();
}

renderAll();