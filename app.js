let courses = JSON.parse(localStorage.getItem("courses")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

/* CREAZIONE CORSO */
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
  renderAll();
}

/* SELECT */
function updateSelect() {
  let select = document.getElementById("courseSelect");
  select.innerHTML = "";

  courses.forEach((c, i) => {
    select.innerHTML += `<option value="${i}">${c.name}</option>`;
  });
}

/* PRESENZA */
function present() {
  let id = document.getElementById("courseSelect").value;
  let h = Number(document.getElementById("hours").value);

  if (!courses[id]) return;

  courses[id].done += h;

  save();
  renderAll();
}

/* ASSENZA */
function absent() {
  let id = document.getElementById("courseSelect").value;
  let h = Number(document.getElementById("hours").value);

  if (!courses[id]) return;

  courses[id].absent += h;

  save();
  renderAll();
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

/* RENDER */
function renderCourses() {
  let box = document.getElementById("courses");
  box.innerHTML = "";

  courses.forEach(c => {
    let percent = ((c.done / c.total) * 100).toFixed(1);

    box.innerHTML += `
      <div class="item">
        <b>${c.name}</b><br>
        Ore: ${c.done}/${c.total}<br>
        Assenze: ${c.absent}<br>
        Avanzamento: ${percent}%
      </div>
    `;
  });
}

function renderCalendar() {
  let box = document.getElementById("calendar");
  if (!box) return;

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
function renderAll() {
  renderCourses();
  renderCalendar();
  updateSelect();
}

renderAll();