import PubSub, { object } from "./index.js";

export default (function () {
  // Takes the Object being operated on, the project name, and the subtitle name as arguments, from which paths will be constructed
  let currentProject = null;
  let currentSubProject = null;

  function init(title, subtitle = null) {
    const contentDiv = document.getElementById("workspace");
    contentDiv.innerHTML = "";
    if (!object.Projects[title]) return;
    let workingObject = object.Projects[title]; // initialize
    if (subtitle) {
      currentProject = title;
      currentSubProject = subtitle;
      renderTodos(subtitle, object.Projects[title][subtitle]);
    } else {
      currentProject = title;
      currentSubProject = null;
      const projDiv = document.createElement("div");
      projDiv.classList.add("pDiv");
      const projName = document.createElement("h1");
      projName.textContent = title;
      projDiv.appendChild(projName);
      contentDiv.appendChild(projDiv);
      for (const [project, _] of Object.entries(workingObject)) {
        renderTodos(project, workingObject[project]);
      }
    }
  }

  PubSub.subscribe("Project Clicked", function (title, subtitle) {
    init(title, subtitle);
  });

  PubSub.subscribe("Name Change", function (nameChange, option) {
    console.log(option);
    switch (option) {
      case 1:
        init(currentProject); // Project to Display
        break;
      case 2:
        init(currentProject, nameChange); // SubProject To Display
        break;
      case 3:
        init(nameChange); // Project to Display
        break;
      case 4:
        init(nameChange, currentSubProject); // SubProject To Display
        break;

      default:
        break;
    }
  });

  PubSub.subscribe("New Project", function (title) {
    init(title);
  });

  PubSub.subscribe("Remove Project", function (title) {
    init(title);
  });

  function renderTodos(projTitle, subProject) {
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
