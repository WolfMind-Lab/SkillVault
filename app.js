let courses = JSON.parse(localStorage.getItem("courses")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

/* =========================
   CREA CORSO
========================= */
function addCourse() {
  const name = document.getElementById("courseName").value;
  const total = Number(document.getElementById("totalHours").value);

  if (!name || total <= 0) return;

  courses.push({
    name: name,
    totalHours: total,
    doneHours: 0,
    absentHours: 0,
    tolerancePercent: 20
  });

  save();
  renderAll();
}

/* =========================
   PRESENZA
========================= */
function present() {
  const id = document.getElementById("courseSelect").value;
  const hours = Number(document.getElementById("hours").value);

  if (!courses[id] || hours <= 0) return;

  courses[id].doneHours += hours;

  save();
  renderAll();
}

/* =========================
   ASSENZA
========================= */
function absent() {
  const id = document.getElementById("courseSelect").value;
  const hours = Number(document.getElementById("hours").value);

  if (!courses[id] || hours <= 0) return;

  courses[id].absentHours += hours;

  save();
  renderAll();
}

/* =========================
   REGOLE
========================= */
function getStatus(c) {
  const total = c.totalHours || 0;
  const absent = c.absentHours || 0;
  const tolerance = c.tolerancePercent || 20;

  const maxAbsence = total * (tolerance / 100);

  if (absent > maxAbsence) return "🔴 Fuori limite assenze";
  if (absent > maxAbsence * 0.7) return "🟡 Attenzione assenze";
  return "🟢 In regola";
}

/* =========================
   RENDER CORSI
========================= */
function renderCourses() {
  const box = document.getElementById("courses");
  box.innerHTML = "";

  courses.forEach((c) => {
    const total = c.totalHours || 0;
    const done = c.doneHours || 0;
    const absent = c.absentHours || 0;
    const tolerance = c.tolerancePercent || 20;

    const progress = total > 0 ? ((done / total) * 100).toFixed(1) : 0;
    const maxAbsence = total * (tolerance / 100);

    box.innerHTML += `
      <div class="item">
        <b>${c.name}</b><br><br>

        📌 Ore totali: ${total}<br>
        ✅ Frequentate: ${done}<br>
        ❌ Assenze: ${absent}<br><br>

        📊 Avanzamento: ${progress}%<br>

        ⚖️ Tolleranza: ${tolerance}% (${maxAbsence} ore)<br><br>

        🚨 Stato: ${getStatus(c)}
      </div>
    `;
  });
}

/* =========================
   SELECT CORSI
========================= */
function updateSelect() {
  const select = document.getElementById("courseSelect");
  select.innerHTML = "";

  courses.forEach((c, i) => {
    select.innerHTML += `<option value="${i}">${c.name}</option>`;
  });
}

/* =========================
   CALENDARIO
========================= */
function addEvent() {
  const text = document.getElementById("eventText").value;

  if (!text) return;

  events.push({
    text,
    date: new Date().toLocaleDateString()
  });

  save();
  renderAll();
}

function renderEvents() {
  const box = document.getElementById("calendar");
  if (!box) return;

  box.innerHTML = "";

  events.forEach((e) => {
    box.innerHTML += `
      <div class="item">
        📅 ${e.date} - ${e.text}
      </div>
    `;
  });
}

/* =========================
   SALVATAGGIO
========================= */
function save() {
  localStorage.setItem("courses", JSON.stringify(courses));
  localStorage.setItem("events", JSON.stringify(events));
}

/* =========================
   INIT
========================= */
function renderAll() {
  renderCourses();
  updateSelect();
  renderEvents();
}

renderAll();