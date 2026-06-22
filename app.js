let profile = JSON.parse(localStorage.getItem("profile")) || {
  name: "Utente",
  goal: "Non definito"
};

let paths = JSON.parse(localStorage.getItem("paths")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];

/* =========================
   IDENTITÀ EDUCATIVA
========================= */
function saveProfile() {
  profile.name = document.getElementById("userName").value;
  profile.goal = document.getElementById("userGoal").value;

  localStorage.setItem("profile", JSON.stringify(profile));
  renderProfile();
}

function renderProfile() {
  const box = document.getElementById("profile");

  if (!box) return;

  box.innerHTML = `
    <div class="item">
      🧭 <b>Identità educativa</b><br><br>
      👤 Nome: ${profile.name}<br>
      🎯 Obiettivo: ${profile.goal}
    </div>
  `;
}

/* =========================
   PERCORSI EDUCATIVI
========================= */
function addPath() {
  const name = document.getElementById("pathName").value;
  const type = document.getElementById("educationType").value;

  if (!name || !type) return;

  paths.push({
    name,
    type,
    courses: []
  });

  save();
  renderAll();
}

/* =========================
   CORSO CON REGOLE
========================= */
function addCourse() {
  const pathId = document.getElementById("pathSelect").value;
  const name = document.getElementById("courseName").value;
  const total = Number(document.getElementById("totalHours").value);
  const tolerance = Number(document.getElementById("tolerance").value);

  if (!paths[pathId] || !name || total <= 0) return;

  paths[pathId].courses.push({
    name,
    totalHours: total,
    doneHours: 0,
    absentHours: 0,
    tolerancePercent: tolerance
  });

  save();
  renderAll();
}

/* =========================
   REGISTRO
========================= */
function addLog(type) {
  const pathId = document.getElementById("pathSelect").value;
  const courseId = document.getElementById("courseSelect").value;
  const hours = Number(document.getElementById("hours").value);

  const course = paths[pathId]?.courses[courseId];
  if (!course || hours <= 0) return;

  if (type === "present") {
    course.doneHours += hours;
  } else {
    course.absentHours += hours;
  }

  logs.push({
    date: new Date().toLocaleDateString(),
    type,
    hours,
    pathId,
    courseId
  });

  save();
  renderAll();
}

/* =========================
   STATO
========================= */
function getStatus(c) {
  const maxAbs = c.totalHours * (c.tolerancePercent / 100);

  if (c.absentHours > maxAbs) return "🔴 BLOCCATO";
  if (c.absentHours > maxAbs * 0.7) return "🟡 ATTENZIONE";
  return "🟢 OK";
}

/* =========================
   RENDER PERCORSI
========================= */
function renderPaths() {
  const box = document.getElementById("paths");
  const select = document.getElementById("pathSelect");

  if (!box || !select) return;

  box.innerHTML = "";
  select.innerHTML = "";

  paths.forEach((p, i) => {

    select.innerHTML += `<option value="${i}">${p.name}</option>`;

    box.innerHTML += `
      <div class="item">
        🎓 <b>${p.name}</b><br>
        📚 Tipo: ${p.type}<br>
        📦 Corsi: ${p.courses.length}
      </div>
    `;
  });
}

/* =========================
   RENDER CORSI
========================= */
function renderCourses() {
  const pathId = document.getElementById("pathSelect").value;
  const box = document.getElementById("courses");

  if (!box) return;

  box.innerHTML = "";

  const courses = paths[pathId]?.courses || [];

  courses.forEach(c => {

    const progress = c.totalHours
      ? ((c.doneHours / c.totalHours) * 100).toFixed(1)
      : 0;

    const maxAbs = c.totalHours * (c.tolerancePercent / 100);

    box.innerHTML += `
      <div class="item">
        📘 <b>${c.name}</b><br><br>

        📌 Totale: ${c.totalHours}<br>
        ✅ Frequentate: ${c.doneHours}<br>
        ❌ Assenze: ${c.absentHours}<br><br>

        📊 Avanzamento: ${progress}%<br>

        ⚖️ Tolleranza: ${c.tolerancePercent}% (${maxAbs}h)<br><br>

        🚨 Stato: ${getStatus(c)}
      </div>
    `;
  });
}

/* =========================
   LOG
========================= */
function renderLogs() {
  const box = document.getElementById("logs");
  if (!box) return;

  box.innerHTML = "";

  logs.slice().reverse().forEach(l => {

    const course = paths[l.pathId]?.courses[l.courseId];

    box.innerHTML += `
      <div class="item">
        📅 ${l.date}<br>
        📘 ${course?.name || "corso"}<br>
        ${l.type === "present" ? "✔ Presenza" : "❌ Assenza"} - ${l.hours}h
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
}

renderAll();