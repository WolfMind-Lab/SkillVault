let paths = JSON.parse(localStorage.getItem("paths")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];

/* =========================
   CREA PERCORSO EDUCATIVO
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
   CREA CORSO CON TOLLERANZA PERSONALIZZATA
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
   PRESENZA / ASSENZA
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
   STATO CORSO
========================= */
function getStatus(c) {
  const maxAbs = c.totalHours * (c.tolerancePercent / 100);

  if (c.absentHours > maxAbs) return "🔴 ESCLUSO / NON AMMESSO";
  if (c.absentHours > maxAbs * 0.7) return "🟡 RISCHIO";
  return "🟢 REGOLARE";
}

/* =========================
   RENDER PERCORSI
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
        <b>🎓 ${p.name}</b><br>
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

  box.innerHTML = "";

  const courses = paths[pathId]?.courses || [];

  courses.forEach((c, i) => {

    const progress = c.totalHours
      ? ((c.doneHours / c.totalHours) * 100).toFixed(1)
      : 0;

    const maxAbs = c.totalHours * (c.tolerancePercent / 100);

    box.innerHTML += `
      <div class="item">
        <b>📘 ${c.name}</b><br><br>

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
   LOG REGISTRO
========================= */
function renderLogs() {
  const box = document.getElementById("logs");
  if (!box) return;

  box.innerHTML = "";

  logs.slice().reverse().forEach(l => {

    const course = paths[l.pathId]?.courses[l.courseId];

    box.innerHTML += `
      <div class="item">
        📅 ${l.date} - ${course?.name || "corso"}<br>
        ${l.type === "present" ? "✔ Presenza" : "❌ Assenza"} - ${l.hours}h
      </div>
    `;
  });
}

/* =========================
   SAVE + INIT
========================= */
function save() {
  localStorage.setItem("paths", JSON.stringify(paths));
  localStorage.setItem("logs", JSON.stringify(logs));
}

function renderAll() {
  renderPaths();
  renderCourses();
  renderLogs();
}

renderAll();