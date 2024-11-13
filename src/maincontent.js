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
      renderTodos(title, subtitle, object.Projects[title][subtitle]);
    } else {
      currentProject = title;
      currentSubProject = null;
      const projDiv = document.createElement("div");
      projDiv.classList.add("pDiv");
      const projName = document.createElement("h1");
      projName.addEventListener("dblclick", changeToInput);
      projName.textContent = title;
      projName.dataset.project = title;
      projName.dataset.subProject = null;
      projDiv.appendChild(projName);
      contentDiv.appendChild(projDiv);
      for (const [subProject, _] of Object.entries(workingObject)) {
        renderTodos(title, subProject, workingObject[subProject]);
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

  function renderTodos(title, subTitle, subProject) {
    // Takes Subproject Names as Arguments
    const workspace = document.getElementById("workspace");
    const projectCard = document.createElement("div");
    projectCard.classList.add("projectCard");
    workspace.appendChild(projectCard);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("contentTitle");
    const projectTitle = document.createElement("h1");
    projectTitle.addEventListener("dblclick", changeToInput);
    projectTitle.textContent = subTitle;
    projectTitle.dataset.project = title;
    projectTitle.dataset.subProject = subTitle;

    titleDiv.appendChild(projectTitle);
    projectCard.appendChild(titleDiv);
    for (const [todo, contents] of Object.entries(subProject)) {
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");
      const todoTitle = document.createElement("h3");
      todoTitle.dataset.project = projectTitle.textContent;
      todoTitle.textContent = todo;

      todoDiv.appendChild(todoTitle);
      for (const [name, value] of Object.entries(contents)) {
        const p = document.createElement("p");
        p.dataset.project = projectTitle.textContent;
        p.dataset.subProject = todoTitle.textContent;
        p.textContent = value;
        todoDiv.appendChild(p);
      }
      projectCard.appendChild(todoDiv);
    }
  }

  function changeToInput() {
    const inputBox = document.createElement("input");
    inputBox.classList.add("clearBox");
    const elementType = this.nodeName;
    const project = this.dataset.project;
    const subProject = this.dataset.subProject;
    inputBox.dataset.elementType = elementType;
    inputBox.dataset.project = project;
    inputBox.dataset.subProject = subProject;
    inputBox.addEventListener("focusout", convertToText);
    inputBox.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        this.blur();
      }
    });

    // dynamic resizing
    inputBox.addEventListener("input", dynamicResize);
    inputBox.style.width = "5px";

    // This Ensures Preexisting Text Doesn't Morph on Tag Change
    inputBox.style.fontSize = getComputedStyle(this).fontSize;
    inputBox.style.fontWeight = getComputedStyle(this).fontWeight;
    inputBox.style.fontFamily = getComputedStyle(this).fontFamily;
    inputBox.style.lineHeight = getComputedStyle(this).lineHeight;
    inputBox.style.textAlign = getComputedStyle(this).textAlign;
    inputBox.style.margin = getComputedStyle(this).margin;
    inputBox.style.padding = getComputedStyle(this).padding;

    this.parentNode.replaceChild(inputBox, this);
    inputBox.focus();
  }

  function dynamicResize() {
    // Create a temporary span element to measure text width
    const span = document.createElement("span");
    span.style.visibility = "hidden"; // Make it invisible
    span.style.whiteSpace = "pre"; // Preserve spaces for accurate width measurement
    span.style.font = window.getComputedStyle(this).font; // Match input's font for accurate measurement
    span.textContent = this.value || this.placeholder; // Use the input's value, or placeholder if empty
    document.body.appendChild(span); // Add span to the document

    // Set input width based on span's width
    this.style.width = `${span.offsetWidth + 10}px`; // Extra padding for better UX (cursor space)

    document.body.removeChild(span); // Clean up the temporary span element
  }

  function convertToText() {
    const elementType = this.dataset.elementType;
    const project = this.dataset.project;
    const subProject = this.dataset.subProject;
    const title = this.value;
    console.log(elementType, project, subProject, title);
  }
});
