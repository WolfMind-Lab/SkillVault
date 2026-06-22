let courses = JSON.parse(localStorage.getItem("courses")) || [];
let files = JSON.parse(localStorage.getItem("files")) || [];

/* AGGIUNGI CORSO */
function addCourse() {

  let name = document.getElementById("name").value;
  let total = Number(document.getElementById("total").value);
  let done = Number(document.getElementById("done").value);
  let limit = Number(document.getElementById("absenceLimit").value);

  if (!name) return;

  let absence = total - done;

  let status = "🟢 In regola";

  if (absence > limit) {
    status = "🔴 Fuori limite assenze";
  } else if (absence > limit * 0.7) {
    status = "🟡 Attenzione assenze";
  }

  courses.push({
    name,
    total,
    done,
    absence,
    limit,
    status
  });

  save();
  render();
}

/* RENDER */
function render() {

  let list = document.getElementById("list");
  list.innerHTML = "";

  courses.forEach(c => {
    list.innerHTML += `
      <div class="item">
        <b>${c.name}</b><br>
        Ore: ${c.done}/${c.total}<br>
        Assenze: ${c.absence} / ${c.limit}<br>
        Stato: ${c.status}
      </div>
    `;
  });

  let f = document.getElementById("files");
  f.innerHTML = "";

  files.forEach(x => {
    f.innerHTML += `<div class="item">📄 ${x}</div>`;
  });
}

/* FILE */
function addFile() {
  let file = document.getElementById("file").files[0];
  if (!file) return;

  files.push(file.name);
  save();
  render();
}

/* SAVE */
function save() {
  localStorage.setItem("courses", JSON.stringify(courses));
  localStorage.setItem("files", JSON.stringify(files));
}

/* INIT */
render();