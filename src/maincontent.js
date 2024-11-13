import PubSub from "./index.js";

export default (function () {
  // Takes the Object being operated on, the project name, and the subtitle name as arguments, from which paths will be constructed

  function init(object, title, subtitle) {
    let workingObject = object.Projects[title]; // initialize
    const contentDiv = document.getElementById("workspace");
    contentDiv.innerHTML = "";
    if (subtitle) {
      renderTodos(title, object.Projects[title][subtitle]); // use dot notation for strings
    } else {
      const projDiv = document.createElement("div");
      projDiv.classList.add("pDiv");
      const projName = document.createElement("h1");
      projName.textContent = title;
      projDiv.appendChild(projName);
      contentDiv.appendChild(projDiv);
      for (const [project, object] of Object.entries(workingObject)) {
        renderTodos(project, workingObject[project]);
      }
    }
  }

  PubSub.subscribe("Project Clicked", function (object, title, subtitle) {
    init(object, title, subtitle);
  });

  function renderTodos(projTitle, subProject) {
    console.log(subProject);
    // Takes Subproject Names as Arguments
    const workspace = document.getElementById("workspace");
    const projectCard = document.createElement("div");
    projectCard.classList.add("projectCard");
    workspace.appendChild(projectCard);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("contentTitle");
    const projectTitle = document.createElement("h1");
    projectTitle.textContent = projTitle;
    titleDiv.appendChild(projectTitle);
    projectCard.appendChild(titleDiv);
    for (const [todo, contents] of Object.entries(subProject)) {
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
});
