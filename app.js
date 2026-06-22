let classes = JSON.parse(localStorage.getItem("classes")) || [];
let lessons = JSON.parse(localStorage.getItem("lessons")) || [];

/* =========================
   CREA CLASSE / CORSO
========================= */
function addClass() {
  const name = document.getElementById("courseName").value;
  const totalHours = Number(document.getElementById("totalHours").value);

  if (!name || totalHours <= 0) return;

  classes.push({
    name,
    totalHours,
    doneHours: 0,
    absentHours: 0,
    tolerance: 20
  });

  save();
  renderAll();
}

/* =========================
   REGISTRO LEZIONE (PRESENZA)
========================= */
function present() {
  const id = document.getElementById("courseSelect").value;
  const hours = Number(document.getElementById("hours").value);

  if (!classes[id] || hours <= 0) return;

  classes[id].doneHours += hours;

  lessons.push({
    classId: id,
    type: "presenza",
    hours,
    date: new Date().toLocaleDateString()
  });

  save();
  renderAll();
}

/* =========================
   REGISTRO ASSENZA
========================= */
function absent() {
  const id = document.getElementById("courseSelect").value;
  const hours = Number(document.getElementById("hours").value);

  if (!classes[id] || hours <= 0) return;

  classes[id].absentHours += hours;

  lessons.push({
    classId: id,
    type: "assenza",
    hours,
    date: new Date().toLocaleDateString()
  });

  save();
  renderAll();
}

/* =========================
   CALCOLO STATO
========================= */
function getStatus(c) {
  const maxAbsence = c.totalHours * (c.tolerance / 100);

  if (c.absentHours > maxAbsence) return "🔴 NON AMMESSO";
  if (c.absentHours > maxAbsence * 0.7) return "🟡 RISCHIO";
  return "🟢 OK";
}

/* =========================
   RENDER CLASSI
========================= */
function renderClasses() {
  const box = document.getElementById("courses");
  box.innerHTML = "";

  classes.forEach((c) => {

    const progress = c.totalHours > 0
      ? ((c.doneHours / c.totalHours) * 100).toFixed(1)
      : 0;

    const maxAbsence = c.totalHours * (c.tolerance / 100);

    box.innerHTML += `
      <div class="item">
        <b>🏫 ${c.name}</b><br><br>

        📌 Ore totali: ${c.totalHours}<br>
        ✅ Frequentate: ${c.doneHours}<br>
        ❌ Assenze: ${c.absentHours}<br><br>

        📊 Avanzamento: ${progress}%<br>

        ⚖️ Tolleranza: ${c.tolerance}% (${maxAbsence} ore)<br><br>

        🚨 Stato: ${getStatus(c)}
      </div>
    `;
  });
}

/* =========================
   SELECT CLASSI
========================= */
function updateSelect() {
  const select = document.getElementById("courseSelect");
  select.innerHTML = "";

  classes.forEach((c, i) => {
    select.innerHTML += `<option value="${i}">${c.name}</option>`;
  });
}

/* =========================
   RENDER REGISTRO
========================= */
function renderLessons() {
  const box = document.getElementById("calendar");
  if (!box) return;

  box.innerHTML = "";

  lessons.slice().reverse().forEach((l) => {

    const className = classes[l.classId]?.name || "Classe eliminata";

    box.innerHTML += `
      <div class="item">
        📅 ${l.date} - ${className}<br>
        ${l.type === "presenza" ? "✔ Presenza" : "❌ Assenza"} - ${l.hours}h
      </div>
    `;
  });
}

/* =========================
   SALVATAGGIO
========================= */
function save() {
  localStorage.setItem("classes", JSON.stringify(classes));
  localStorage.setItem("lessons", JSON.stringify(lessons));
}

/* =========================
   INIT
========================= */
function renderAll() {
  renderClasses();
  updateSelect();
  renderLessons();
}

renderAll();