let profile = JSON.parse(localStorage.getItem("profile")) || {};
let paths = JSON.parse(localStorage.getItem("paths")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];

/* =========================
   UTILITY SICURE
========================= */
function num(v) {
  return Number(v) || 0;
}

/* =========================
   PROFILO
========================= */
function saveProfile() {
  profile = {
    name: userName.value || "",
    goal: userGoal.value || ""
  };

  save();
  renderAll();
}

/* =========================
   PERCORSI
========================= */
function addPath() {
  if (!pathName.value) return;

  paths.push({
    id: Date.now().toString(),
    name: pathName.value,
    type: educationType.value || "Non definito",
    courses: []
  });

  save();
  renderAll();
}

/* =========================
   CORSI
========================= */
function addCourse() {
  const path = paths.find(p => p.id === pathSelect.value);
  if (!path) return;

  path.courses.push({
    id: Date.now().toString(),
    name: courseName.value,
    totalHours: num(totalHours.value),
    doneHours: 0,
    absentHours: 0,
    tolerance: num(tolerance.value),
    calendar: []
  });

  save();
  renderAll();
}

/* =========================
   REGISTRO
========================= */
function addLog(type) {
  const path = paths.find(p => p.id === pathSelect.value);
  const course = path?.courses.find(c => c.id === courseSelect.value);
  if (!course) return;

  const h = num(hours.value);
  if (!h) return;

  if (type === "present") course.doneHours += h;
  else course.absentHours += h;

  logs.push({
    id: Date.now().toString(),
    date: new Date().toLocaleDateString(),
    type,
    hours: h,
    courseId: course.id
  });

  save();
  renderAll();
}

/* =========================
   CALENDARIO (PER CORSO)
========================= */
function addEvent() {
  const path = paths.find(p => p.id === pathSelect.value);
  const course = path?.courses.find(c => c.id === courseSelect.value);
  if (!course || !eventText.value) return;

  course.calendar.push({
    id: Date.now().toString(),
    text: eventText.value,
    date: new Date().toLocaleDateString()
  });

  save();
  renderCalendar();
}

/* =========================
   CALENDARIO RENDER
========================= */
function renderCalendar() {
  const path = paths.find(p => p.id === pathSelect.value);
  const course = path?.courses.find(c => c.id === courseSelect.value);

  calendar.innerHTML = "";

  (course?.calendar || []).forEach(e => {
    calendar.innerHTML += `
      <div class="item">
        📅 ${e.date}<br>
        📘 ${course.name}<br>
        ${e.text}
      </div>
    `;
  });
}

/* =========================
   CV AUTOMATICO
========================= */
function generateCV() {
  cv.innerHTML = `
    <div class="item">
      <h3>📄 CV</h3>
      👤 ${profile.name || ""}<br>
      🎯 ${profile.goal || ""}<br><br>

      ${paths.map(p => `
        <b>${p.type} - ${p.name}</b><br>
        ${p.courses.map(c => `
          • ${c.name} (${c.doneHours}/${c.totalHours}h)
        `).join("<br>")}
        <br><br>
      `).join("")}
    </div>
  `;
}

/* =========================
   PORTFOLIO
========================= */
function renderPortfolio() {
  let totalCourses = 0;
  let totalHours = 0;

  paths.forEach(p => {
    totalCourses += p.courses.length;
    p.courses.forEach(c => {
      totalHours += c.doneHours;
    });
  });

  portfolio.innerHTML = `
    <div class="item">
      💼 Portfolio<br><br>
      🎓 Percorsi: ${paths.length}<br>
      📚 Corsi: ${totalCourses}<br>
      ⏱ Ore completate: ${totalHours}
    </div>
  `;
}

/* =========================
   SELECT SINCRONIZZATI
========================= */
function renderPaths() {
  pathSelect.innerHTML = "";
  paths.forEach(p => {
    pathSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });

  renderCourses();
  renderCalendar();
}

function renderCourses() {
  const path = paths.find(p => p.id === pathSelect.value);

  courseSelect.innerHTML = "";
  courses.innerHTML = "";

  (path?.courses || []).forEach(c => {

    courseSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;

    const tol = c.tolerance ?? 0;
    const maxAbs = c.totalHours * (tol / 100);

    courses.innerHTML += `
      <div class="item">
        📘 ${c.name}<br>
        ✅ ${c.doneHours}h / ${c.totalHours}h<br>
        ❌ Assenze: ${c.absentHours}<br>
        ⚖️ Tolleranza: ${tol}% (${isNaN(maxAbs) ? 0 : maxAbs}h)
      </div>
    `;
  });

  renderCalendar();
}

/* =========================
   LOGS
========================= */
function renderLogs() {
  logsBox.innerHTML = "";

  logs.slice().reverse().forEach(l => {
    const course = paths
      .flatMap(p => p.courses)
      .find(c => c.id === l.courseId);

    logsBox.innerHTML += `
      <div class="item">
        📅 ${l.date} - ${course?.name || ""}<br>
        ${l.type === "present" ? "✔" : "❌"} ${l.hours}h
      </div>
    `;
  });
}

/* =========================
   SAVE
========================= */
function save() {
  localStorage.setItem("profile", JSON.stringify(profile));
  localStorage.setItem("paths", JSON.stringify(paths));
  localStorage.setItem("logs", JSON.stringify(logs));
}

/* =========================
   RENDER MASTER
========================= */
function renderAll() {
  renderPaths();
  renderCourses();
  renderLogs();
  renderPortfolio();
  renderCalendar();
}

/* =========================
   INIT
========================= */
renderAll();