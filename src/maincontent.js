export default (function (object, title, subtitle) {
  // Takes the Object being operated on, the project name, and the subtitle name as arguments, from which paths will be constructed
  let workingObject = object.Projects; // initialize

  function init() {
    const contentDiv = document.getElementById("workspace");
    contentDiv.innerHTML = "";
    if (subtitle) {
      renderTodos(subtitle);
    } else {
      const projDiv = document.createElement("div");
      projDiv.classList.add("pDiv");
      const projName = document.createElement("h1");
      projName.textContent = title;
      projDiv.appendChild(projName);
      contentDiv.appendChild(projDiv);
      for (const [project, object] of Object.entries(workingObject[title])) {
        renderTodos(project);
      }
    }
  }

  function renderTodos(subProject) {
    // Takes Subproject Names as Arguments
    const workspace = document.getElementById("workspace");
    const projectCard = document.createElement("div");
    projectCard.classList.add("projectCard");
    workspace.appendChild(projectCard);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("contentTitle");
    const projectTitle = document.createElement("h1");
    projectTitle.textContent = subProject;
    titleDiv.appendChild(projectTitle);
    projectCard.appendChild(titleDiv);
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
      projectCard.appendChild(todoDiv);
    }
  }

  init();
});
