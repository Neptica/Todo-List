import content from "./maincontent.js";
import plus from "./svg/plus.svg";
import setting from "./svg/tune.svg";
import close from "./svg/close-circle.svg";
import done from "./svg/done.png";

export default (function (object) {
  let projects = object.Projects;
  function init() {
    if (projects) renderDashboard();
    renderTaskDash();
  }

  function renderDashboard() {
    const dash = document.getElementById("dashboard");
    dash.innerHTML = "";

    for (const [project, indProjects] of Object.entries(projects)) {
      const projDiv = document.createElement("div");

      projDiv.classList.add("proj");
      const titleCard = document.createElement("div");
      const projTitle = document.createElement("h1");
      // Setup Data Link
      projTitle.dataset.project = project;
      const addMore = document.createElement("img");

      addMore.src = plus;
      addMore.dataset.name = "plus";
      addMore.addEventListener("click", insertInputNode);
      projTitle.textContent = project;
      projTitle.dataset.elementType = "h1";
      projTitle.addEventListener("dblclick", changeTextToInput);
      titleCard.classList.add("titleCard");
      titleCard.addEventListener("click", showContent);

      titleCard.appendChild(projTitle);
      titleCard.appendChild(addMore);
      projDiv.appendChild(titleCard);

      for (const [iProject, values] of Object.entries(indProjects)) {
        const iProjDiv = document.createElement("p");
        // Setup Data Link
        iProjDiv.dataset.project = project;
        iProjDiv.dataset.subproject = iProject;

        iProjDiv.textContent = iProject;
        iProjDiv.dataset.elementType = "p";
        iProjDiv.addEventListener("dblclick", changeTextToInput);
        iProjDiv.addEventListener("click", showContent);
        projDiv.appendChild(iProjDiv);
      }
      dash.appendChild(projDiv);
    }
  }

  function insertInputNode() {
    const projInput = document.createElement("input");
    projInput.classList.add("indProj");
    projInput.dataset.elementType = "p";
    projInput.dataset.newNode = "true";

    const project = this.previousSibling.textContent;
    projInput.dataset.project = project;
    projInput.dataset.subproject = this.dataset.subproject;

    projInput.addEventListener("focusout", convertBack);
    projInput.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        this.blur();
      }
    });

    this.parentNode.after(projInput);

    projInput.focus(); // this makes it focus on the box
  }

  function changeTextToInput() {
    let currentTitle = this.textContent;

    const projInput = document.createElement("input");
    projInput.classList.add("renameProj");

    // This Ensures Preexisting Text Doesn't Morph on Tag Change
    projInput.style.fontSize = getComputedStyle(this).fontSize;
    projInput.style.fontWeight = getComputedStyle(this).fontWeight;
    projInput.style.fontFamily = getComputedStyle(this).fontFamily;
    projInput.style.lineHeight = getComputedStyle(this).lineHeight;
    projInput.style.textAlign = getComputedStyle(this).textAlign;
    projInput.style.margin = getComputedStyle(this).margin;
    projInput.style.padding = getComputedStyle(this).padding;

    // Transfer Data Link
    projInput.dataset.project = this.dataset.project;
    projInput.dataset.subproject = this.dataset.subproject;

    projInput.value = currentTitle;
    projInput.dataset.elementType = this.dataset.elementType;
    projInput.dataset.oldText = currentTitle;
    if (projInput.dataset.elementType == "p")
      projInput.classList.add("indProj");
    else this.parentNode.style.backgroundColor = "inherit";

    projInput.addEventListener("focusout", convertBack);
    projInput.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        this.blur();
      }
    });

    this.parentNode.replaceChild(projInput, this);

    projInput.focus(); // this makes it focus nicely
  }

  function convertBack() {
    // TODO: Fix Object Naming Collisions
    let currentTitle = this.value;
    if (currentTitle == "") {
      if (typeof this.dataset.oldText === "undefined") {
        this.parentNode.removeChild(this);
        return;
      }

      // console.log(this.dataset.oldText);
      currentTitle = this.dataset.oldText;
    }

    const currentType = this.dataset.elementType;

    const projTitle = document.createElement(currentType);

    projTitle.textContent = currentTitle;
    projTitle.dataset.elementType = this.dataset.elementType;
    projTitle.addEventListener("dblclick", changeTextToInput);

    let project = this.dataset.project;
    let subproject = this.dataset.subproject;
    if (this.dataset.elementType == "p") {
      if (this.dataset.newNode != "true") {
        projects[project][currentTitle] = projects[project][subproject];
        delete projects[project][subproject];
      } else {
        projects[project][currentTitle] = {};
      }
      projTitle.dataset.project = this.dataset.project;
      projTitle.dataset.subproject = currentTitle;
      projTitle.addEventListener("click", showContent);
    } else {
      projTitle.dataset.project = currentTitle;
      projects[currentTitle] = projects[project];
      delete projects[project];

      // Update current sub elements
      const titleCard = this.parentNode.parentNode;
      const subprojs = titleCard.querySelectorAll("p");
      for (const subproj of subprojs) subproj.dataset.project = currentTitle;
    }
    this.parentNode.replaceChild(projTitle, this);
    object.Projects = projects;
    localStorage.setItem("data", JSON.stringify(object));
  }

  function renderTaskDash() {
    const taskControl = document.getElementById("dashboard__controls");
    const newCard = document.createElement("div");
    const add = document.createElement("img");
    add.src = plus;
    const newList = document.createElement("p");
    newList.textContent = "New List";
    const settings = document.createElement("img");
    settings.src = setting;
    settings.style.cursor = "pointer";
    settings.dataset.name = "plus";
    settings.addEventListener("click", changeProjectButtons);

    newCard.appendChild(add);
    newCard.appendChild(newList);
    newCard.style.cursor = "pointer";
    newCard.addEventListener("click", newProject);

    taskControl.appendChild(newCard);
    taskControl.appendChild(settings);
  }

  function newProject() {
    const dash = document.getElementById("dashboard");
    const projDiv = document.createElement("div");

    projDiv.classList.add("proj");
    const titleCard = document.createElement("div");
    const projTitle = document.createElement("h1");
    const addMore = document.createElement("img");

    addMore.src = plus;
    addMore.addEventListener("click", insertInputNode);
    projTitle.textContent = "New Project";
    projects["New Project"] = {};
    object.Projects = projects;
    localStorage.setItem("data", JSON.stringify(object));

    projTitle.dataset.elementType = "h1";
    projTitle.addEventListener("dblclick", changeTextToInput);
    titleCard.classList.add("titleCard");
    titleCard.addEventListener("click", showContent);

    titleCard.appendChild(projTitle);
    titleCard.appendChild(addMore);
    projDiv.appendChild(titleCard);

    dash.appendChild(projDiv);
  }

  function changeProjectButtons() {
    // Update Dashboard
    const dash = document.getElementById("dashboard");
    const currentButtons = dash.querySelectorAll("img");
    const incomingButton = this.dataset.name;

    for (const button of currentButtons) {
      const newButton = document.createElement("img");

      if (incomingButton == "plus") {
        newButton.src = close;
        newButton.addEventListener("click", removeProject);
      } else {
        newButton.src = plus;
        newButton.addEventListener("click", insertInputNode);
      }

      button.parentNode.replaceChild(newButton, button);
    }

    // Switch TaskDash Button
    const taskDash = document.getElementById("dashboard__controls");
    const controlButton = document.createElement("img");
    if (incomingButton == "plus") {
      controlButton.dataset.name = "check";
      controlButton.src = done;
    } else {
      controlButton.dataset.name = "plus";
      controlButton.src = setting;
    }
    controlButton.style.cursor = "pointer";
    controlButton.addEventListener("click", changeProjectButtons);
    taskDash.replaceChild(controlButton, this);
  }
  function removeProject() {
    const projDiv = this.parentNode.parentNode; // projDiv > TitleCard > img
    const nameOfProject = this.previousSibling.textContent;
    delete projects[nameOfProject];
    object.Projects = projects;
    localStorage.setItem("data", JSON.stringify(object));

    projDiv.parentNode.removeChild(projDiv);
  }

  function showContent() {
    let project = 0;
    let subProject = 0;
    const pTags = document.querySelectorAll("p");
    for (const tag of pTags) {
      tag.style.backgroundColor = "inherit";
    }
    const h1Tags = document.querySelectorAll("h1");
    for (const tag of h1Tags) {
      tag.parentNode.style.backgroundColor = "inherit";
    }

    if (this.dataset.elementType == "p") {
      // Get Project Tree
      project = this.dataset.project;
      subProject = this.dataset.subproject;
    } else {
      project = this.firstChild.textContent;
    }

    this.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    content(object, project, subProject);
  }

  init();
});
