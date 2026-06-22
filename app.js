let profile = JSON.parse(localStorage.getItem("profile")) || {};
let paths = JSON.parse(localStorage.getItem("paths")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];

/* =========================
   UTILITY ID
========================= */
function uid() {
  return Date.now() + Math.random().toString(16).slice(2);
}

/* =========================
   PROFILO
========================= */
function saveProfile() {
  profile = {
    name: userName.value,
    goal: userGoal.value
  };

  save();
  renderAll();
}

/* =========================
   PATH
========================= */
function addPath() {
  if (!pathName.value) return;

  paths.push({
    id: uid(),
    name: pathName.value,
    type: educationType.value,
    courses: []
  });

  save();
  renderAll();
}

/* =========================
   COURSE
========================= */
function addCourse() {
  const path = paths.find(p => p.id === pathSelect.value);
  if (!path) return;

  path.courses.push({
    id: uid(),
    name: courseName.value,
    totalHours: Number(totalHours.value),
    doneHours: 0,
    absentHours: 0,
    tolerance: Number(tolerance.value),
    calendar: []
  });

  save();
  renderAll();
}

/* =========================
   SELECT RENDER (SYNC SICURA)
========================= */
function renderSelects() {
  pathSelect.innerHTML = "";
  courseSelect.innerHTML = "";

  paths.forEach(p => {
    pathSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });

  const path = paths.find(p => p.id === pathSelect.value);
  if (!path) return;

  path.courses.forEach(c => {
    courseSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

/* =========================
   LOG PRESENZE
========================= */
function addLog(type) {
  const path = paths.find(p => p.id === pathSelect.value);
  if (!path) return;

  const course = path.courses.find(c => c.id === courseSelect.value);
  if (!course) return;

  const h = Number(hours.value);
  if (!h) return;

  if (type === "present") course.doneHours += h;
  else course.absentHours += h;

  logs.push({
    id: uid(),
    date: new Date().toLocaleDateString(),
    type,
    hours: h,
    courseId: course.id
  });

  save();
  renderAll();
}

/* =========================
   CALENDAR (VERO, PER CORSO)
========================= */
function addEvent() {
  const path = paths.find(p => p.id === pathSelect.value);
  if (!path) return;

  const course = path.courses.find(c => c.id === courseSelect.value);
  if (!course) return;

  course.calendar.push({
    id: uid(),
    text: eventText.value,
    date: new Date().toLocaleDateString()
  });

  save();
  renderCalendar();
}

/* =========================
   RENDER CALENDAR
========================= */
function renderCalendar() {
  const path = paths.find(p => p.id === pathSelect.value);
  const course = path?.courses.find(c => c.id === courseSelect.value);

  calendar.innerHTML = "";

  (course?.calendar || []).forEach(e => {
    calendar.innerHTML += `
      <div class="item">
        📅 ${e.date}<br>
        ${e.text}
      </div>
    `;
  });
}

/* =========================
   CV
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
    p.courses.forEach(c => totalHours += c.doneHours);
  });

  portfolio.innerHTML = `
    <div class="item">
      💼 Portfolio<br><br>
      🎓 Percorsi: ${paths.length}<br>
      📚 Corsi: ${totalCourses}<br>
      ⏱ Ore: ${totalHours}
    </div>
  `;
}

/* =========================
   RENDER PRINCIPALE
========================= */
function renderAll() {
  renderSelects();
  renderCalendar();
  renderPortfolio();
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
   CHANGE HANDLER
========================= */
pathSelect?.addEventListener("change", renderAll);
courseSelect?.addEventListener("change", renderAll);

renderAll();