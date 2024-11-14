import PubSub, { getObject, setObject } from "./index.js";

export default (function () {
  // Takes the Object being operated on, the project name, and the subtitle name as arguments, from which paths will be constructed
  let currentProject = null;
  let currentSubProject = null;

  function render(title, subtitle = null, restartWorkspace = false) {
    const contentDiv = document.getElementById("workspace");
    const allProjCard = document.createElement("div");
    allProjCard.classList.add("allProj");

    if (!restartWorkspace) contentDiv.innerHTML = "";
    if (!getObject().Projects[title]) return;
    let workingObject = getObject().Projects[title]; // initialize

    if (subtitle) {
      currentProject = title;
      currentSubProject = subtitle;
      renderTodo(
        title,
        subtitle,
        getObject().Projects[title][subtitle],
        allProjCard,
      );
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
      allProjCard.appendChild(projDiv);
      for (const [subProject, _] of Object.entries(workingObject)) {
        renderTodo(title, subProject, workingObject[subProject], allProjCard);
      }
    }
    updateBottomMargin(allProjCard);
  }

  PubSub.subscribe("Project Clicked", function (title, subtitle) {
    render(title, subtitle);
  });

  PubSub.subscribe("Name Change", function (nameChange, option) {
    // console.log(option);
    switch (option) {
      case 1:
        render(currentProject); // Project to Display
        break;
      case 2:
        render(currentProject, nameChange); // SubProject To Display
        break;
      case 3:
        render(nameChange); // Project to Display
        break;
      case 4:
        render(nameChange, currentSubProject); // SubProject To Display
        break;

      default:
        break;
    }
  });

  PubSub.subscribe("New Project", function (title) {
    render(title);
  });

  PubSub.subscribe("Remove Project", function (title) {
    render(title);
  });

  PubSub.subscribe("Home Clicked", () => {
    const projects = getObject().Projects;
    const contentDiv = document.getElementById("workspace");
    contentDiv.innerHTML = "";
    for (const [title] of Object.entries(projects)) {
      render(title, null, true);
    }
  });

  function renderTodo(
    projectTitle,
    subProjectTitle,
    subProjectObject,
    allProj,
  ) {
    // Takes Subproject Names as Arguments
    const workspace = document.getElementById("workspace");
    workspace.appendChild(allProj);
    // console.log(allProj.firstChild.textContent, title, subProject);
    const projectCard = document.createElement("div");
    projectCard.classList.add("projectCard");
    allProj.appendChild(projectCard);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("contentTitle");
    const projectName = document.createElement("h1");
    projectName.addEventListener("dblclick", changeToInput);
    projectName.textContent = subProjectTitle;
    projectName.dataset.project = projectTitle;
    projectName.dataset.subProject = subProjectTitle;

    titleDiv.appendChild(projectName);
    projectCard.appendChild(titleDiv);
    for (const [todo, contents] of Object.entries(subProjectObject)) {
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");

      for (const [name, value] of Object.entries(contents)) {
        const p = document.createElement("p");
        p.dataset.project = projectTitle;
        p.dataset.subProject = subProjectTitle;
        p.dataset.todo = todo;
        p.textContent = value;
        todoDiv.appendChild(p);
      }
      projectCard.appendChild(todoDiv);
    }
    updateBottomMargin(projectCard);
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
    inputBox.dataset.oldText = this.textContent;
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

  function updateBottomMargin(projectCard) {
    const heightOfCard = projectCard.offsetHeight;
    if (heightOfCard != 0)
      document.documentElement.style.setProperty(
        "--bottom-margin",
        `${heightOfCard}px`,
      );
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
    let newName = this.value;
    if (newName == "") newName = this.dataset.oldText;

    const projects = getObject().Projects;
    const replacementText = document.createElement(elementType);
    replacementText.addEventListener("dblclick", changeToInput);

    if (subProject != "null") {
      replacementText.dataset.elementType = elementType;
      replacementText.dataset.project = project;
      replacementText.dataset.subProject = newName; // changed SubProject Title
      if (newName != this.dataset.oldText) {
        projects[project][newName] = projects[project][subProject];
        delete projects[project][subProject];
      }
    } else {
      replacementText.dataset.elementType = elementType;
      replacementText.dataset.project = newName; // changed Project Title
      replacementText.dataset.subProject = null;
      if (newName != this.dataset.oldText) {
        projects[newName] = projects[project];
        delete projects[project];
      }
      const h1Tags = this.parentNode.parentNode.querySelectorAll("h1");
      for (const tag of h1Tags) tag.dataset.project = newName; // Update subprojects project link
    }

    replacementText.textContent = newName;

    setObject(projects);
    PubSub.publish("Project Change", newName); // newName to make sure proper element is selected
    this.parentNode.replaceChild(replacementText, this);
  }
});
