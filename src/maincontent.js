export default (function (object, title, subtitle) {
  // Takes the Object being operated on, the project name, and the subtitle name as arguments, from which paths will be constructed
  let workingObject = object.Projects; // initialize

  function init() {
    const contentDiv = document.getElementById("workspace");
    contentDiv.innerHTML = "";
    if (subtitle) {
      renderTodos(subtitle);
    } else {
      for (const [project, object] of Object.entries(workingObject[title])) {
        renderTodos(project);
      }
    }
  }

  function renderTodos(subProject) {
    // Takes Subproject Names as Arguments
    const contentDiv = document.getElementById("workspace");
    const projectTitle = document.createElement("h1");
    projectTitle.textContent = subProject;
    contentDiv.appendChild(projectTitle);
    for (const [todo, contents] of Object.entries(
      workingObject[title][subProject],
    )) {
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");
      const todoTitle = document.createElement("h3");
      todoTitle.textContent = todo;

      todoDiv.appendChild(todoTitle);
      for (const [name, value] of Object.entries(contents)) {
        const p = document.createElement("p");
        p.textContent = value;
        todoDiv.appendChild(p);
      }
      contentDiv.appendChild(todoDiv);
    }
  }

  init();
});
