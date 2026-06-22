let courses = JSON.parse(localStorage.getItem("courses")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

/* CREA CORSO */
function addCourse() {
  let name = document.getElementById("courseName").value;
  let total = Number(document.getElementById("totalHours").value);

  if (!name) return;

  courses.push({
    name,
    total,
    done: 0,
    absent: 0
  });

  save();
  renderCourses();
  renderSelect();
}

/* SELECT CORSI */
function renderSelect() {
  let select = document.getElementById("courseSelect");
  select.innerHTML = "";

  courses.forEach((c, i) => {
    select.innerHTML += `<option value="${i}">${c.name}</option>`;
  });
}

/* PRESENZA */
function markPresent() {
  let id = document.getElementById("courseSelect").value;
  let hours = Number(document.getElementById("lessonHours").value);

  if (!courses[id] || !hours) return;

  courses[id].done += hours;

  save();
  renderCourses();
}

/* ASSENZA */
function markAbsent() {
  let id = document.getElementById("courseSelect").value;
  let hours = Number(document.getElementById("lessonHours").value);

  if (!courses[id] || !hours) return;

  courses[id].absent += hours;

  save();
  renderCourses();
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
  renderCalendar();
}

/* RENDER CORSI */
function renderCourses() {
  let box = document.getElementById("courses");
  box.innerHTML = "";

  courses.forEach(c => {

    let percent = ((c.done / c.total) * 100).toFixed(1);

    let status = "🟢 In regola";

    if (c.done + c.absent > c.total) {
      status = "🔴 Superato monte ore";
    }

    box.innerHTML += `
      <div class="item">
        <b>${c.name}</b><br>
        Totale: ${c.total} ore<br>
        Frequentate: ${c.done}<br>
        Assenze: ${c.absent}<br>
        Completamento: ${percent}%<br>
        Stato: ${status}
      </div>
    `;
  });
}

/* CALENDARIO */
function renderCalendar() {
  let box = document.getElementById("calendar");
  box.innerHTML = "";

  events.forEach(e => {
    box.innerHTML += `
      <div class="item">
        📅 ${e.date} - ${e.text}
      </div>
    `;
  });
}

/* SAVE */
function save() {
  localStorage.setItem("courses", JSON.stringify(courses));
  localStorage.setItem("events", JSON.stringify(events));
}

/* INIT */
renderCourses();
renderCalendar();
renderSelect();