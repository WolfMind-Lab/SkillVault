let courses = JSON.parse(localStorage.getItem("courses")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

/* CREAZIONE CORSO CON REGOLE */
function addCourse() {
  let name = document.getElementById("courseName").value;
  let total = Number(document.getElementById("totalHours").value);

  if (!name || !total) return;

  courses.push({
    name,
    totalHours: total,

    doneHours: 0,
    absentHours: 0,

    tolerancePercent: 20, // tolleranza standard 20%
  });

  save();
  renderAll();
}

/* ORE LEZIONE */
function present() {
  let id = document.getElementById("courseSelect").value;
  let h = Number(document.getElementById("hours").value);

  if (!courses[id] || !h) return;

  courses[id].doneHours += h;

  save();
  renderAll();
}

/* ASSENZA */
function absent() {
  let id = document.getElementById("courseSelect").value;
  let h = Number(document.getElementById("hours").value);

  if (!courses[id] || !h) return;

  courses[id].absentHours += h;

  save();
  renderAll();
}

/* PROMEMORIA REGOLE */
function getRules(course) {
  let maxAbsence = course.totalHours * (course.tolerancePercent / 100);
  let usedAbsence = course.absentHours;

  if (usedAbsence > maxAbsence) {
    return "🔴 FUORI LIMITE ASSENZE";
  }

  if (usedAbsence > maxAbsence * 0.7) {
    return "🟡 ATTENZIONE: quasi limite assenze";
  }

  return "🟢 In regola";
}

/* RENDER CORSI */
function renderCourses() {
  let box = document.getElementById("courses");
  box.innerHTML = "";

  courses.forEach((c) => {

    let completed = c.doneHours;
    let absent = c.absentHours;
    let total = c.totalHours;

    let progress = ((completed / total) * 100).toFixed(1);

    let maxAbsence = total * (c.tolerancePercent / 100);

    box.innerHTML += `
      <div class="item">
        <b>${c.name}</b><br><br>

        📌 Ore totali: ${total}<br>
        ✅ Frequentate: ${completed}<br>
        ❌ Assenze: ${absent}<br><br>

        📊 Avanzamento: ${progress}%<br>

        ⚖️ Tolleranza assenze: ${c.tolerancePercent}% (${maxAbsence} ore)<br><br>

        🚨 Stato: ${getRules(c)}
      </div>
    `;
  });
}

/* SELECT CORSI */
function updateSelect() {
  let select = document.getElementById("courseSelect");
  select.innerHTML = "";

  courses.forEach((c, i) => {
    select.innerHTML += `<option value="${i}">${c.name}</option>`;
  });
}

/* CALENDARIO */
function addEvent() {
  let text = document.getElementById("eventText").value;
  if (!text) return;

  events.push({
    text,
    date: new Date().toLocaleDateString()
  });

  save();
  renderAll();
}

/* SAVE */
function save() {
  localStorage.setItem("courses", JSON.stringify(courses));
  localStorage.setItem("events", JSON.stringify(events));
}

/* INIT */
function renderAll() {
  renderCourses();
  updateSelect();
}

renderAll();