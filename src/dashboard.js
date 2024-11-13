import PubSub, { object } from "./index.js";
import plus from "./svg/plus.svg";
import setting from "./svg/tune.svg";
import close from "./svg/close-circle.svg";
import done from "./svg/done.png";

export default (function () {
  let projects = object.Projects;
  let timer = 0;
  let delay = 300;
  let prevent = false;

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
      projTitle.addEventListener("dblclick", function () {
        prevent = true;
        clearTimeout(timer);
        changeTextToInput.call(this);
      });

      titleCard.classList.add("titleCard");
      titleCard.addEventListener("click", function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (!prevent) {
            showContent.call(this);
          } else {
            prevent = false;
          }
        }, delay);
      });

      titleCard.appendChild(projTitle);
      titleCard.appendChild(addMore);
      projDiv.appendChild(titleCard);

      for (const [iProject, values] of Object.entries(indProjects)) {
        const iProjDiv = document.createElement("div");
        iProjDiv.classList.add("spDiv");
        const iProjP = document.createElement("p");

        // Setup Data Link
        iProjP.dataset.project = project;
        iProjP.dataset.subproject = iProject;

        iProjP.textContent = iProject;
        iProjP.dataset.elementType = "p";
        iProjP.addEventListener("dblclick", function () {
          prevent = true;
          clearTimeout(timer);
          changeTextToInput.call(this);
        });
        iProjDiv.addEventListener("click", function () {
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (!prevent) {
              showContent.call(this);
            } else {
              prevent = false;
            }
          }, delay);
        });
        iProjDiv.appendChild(iProjP);
        projDiv.appendChild(iProjDiv);
      }
      dash.appendChild(projDiv);
    }
  }

  function insertInputNode() {
    const iProjDiv = document.createElement("div");
    iProjDiv.classList.add("spDiv");
    iProjDiv.classList.add("indProj"); // clear textbox
    const projInput = document.createElement("input");
    iProjDiv.appendChild(projInput);

    const project = this.previousSibling.textContent;
    projInput.dataset.project = project;
    projInput.dataset.elementType = "p";
    projInput.dataset.newNode = "true";

    projInput.addEventListener("focusout", convertBack);
    projInput.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        this.blur();
      }
    });

    this.parentNode.after(iProjDiv);

    projInput.focus(); // this makes it focus on the box
  }

  function changeTextToInput() {
    // Make Sure click knows not to fire
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
    projInput.dataset.elementType = this.dataset.elementType;

    projInput.value = currentTitle;
    projInput.dataset.oldText = currentTitle;
    if (projInput.dataset.elementType == "p")
      projInput.classList.add("indProj");
    // else this.parentNode.style.backgroundColor = "inherit";

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
    let currentTitle = this.value;

    // Either Delete the New SubProject or Return the Subproject to how it was.
    if (currentTitle == "") {
      if (typeof this.dataset.oldText === "undefined") {
        this.parentNode.removeChild(this);
        return;
      }

      currentTitle = this.dataset.oldText;
    }

    const currentType = this.dataset.elementType;
    const projTitle = document.createElement(currentType);
    projTitle.textContent = currentTitle;
    projTitle.dataset.elementType = currentType;
    projTitle.addEventListener("dblclick", function () {
      prevent = true;
      clearTimeout(timer);
      changeTextToInput.call(this);
    });

    let project = this.dataset.project;
    let subproject = this.dataset.subproject;
    if (currentType == "p") {
      if (this.dataset.newNode == "true") {
        projects[project][currentTitle] = {};
        this.parentNode.addEventListener("click", function () {
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (!prevent) {
              showContent.call(this);
            } else {
              prevent = false;
            }
          }, delay);
        });
      } else if (currentTitle != subproject) {
        // Don't Delete if Name remains the same
        projects[project][currentTitle] = projects[project][subproject];
        delete projects[project][subproject];
      }
      projTitle.dataset.project = project;
      projTitle.dataset.subproject = currentTitle;
    } else {
      projTitle.dataset.project = currentTitle;

      // Do nothing if object Name remains the same
      if (currentTitle != project) {
        projects[currentTitle] = projects[project];
        delete projects[project];
      }

      // Update current sub elements' project title
      const titleCard = this.parentNode.parentNode; // H1 > TitleCard > ProjDiv
      const subprojs = titleCard.querySelectorAll("p");
      for (const subproj of subprojs) subproj.dataset.project = currentTitle;
    }

    let isSubProject = null;
    const isActive = this.parentNode.dataset.active;
    // currentType is that which is being edited
    if (currentType == "p") {
      const parentIsActive =
        this.parentNode.parentNode.firstChild.dataset.active;
      if (parentIsActive === "true") {
        isSubProject = 1; // Reload Parent (Child Change)
      } else if (isActive === "true") isSubProject = 2; // Reload Self (SubProject)
    } else if (isActive === "true")
      isSubProject = 3; // Reload Self (Project)
    // check other divs to see if active
    else {
      const projectCard = this.parentNode.parentNode;
      const divs = projectCard.querySelectorAll("div");
      for (const div of divs) {
        console.log(div.dataset.active);
        if (div.dataset.active === "true") isSubProject = 4;
        // Reload Self (Parent Change)
      }
    }

    this.parentNode.replaceChild(projTitle, this);
    object.Projects = projects;
    localStorage.setItem("data", JSON.stringify(object));
    if (isSubProject) PubSub.publish("Name Change", currentTitle, isSubProject);
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
    projTitle.addEventListener("dblclick", function () {
      prevent = true;
      clearTimeout(timer);
      changeTextToInput.call(this);
    });
    titleCard.classList.add("titleCard");
    titleCard.addEventListener("click", function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!prevent) {
          showContent.call(this);
        } else {
          prevent = false;
        }
      }, delay);
    });

    titleCard.appendChild(projTitle);
    titleCard.appendChild(addMore);
    projDiv.appendChild(titleCard);

    const h1Tags = document.querySelectorAll("h1");
    for (const tag of h1Tags) {
      tag.parentNode.style.backgroundColor = "inherit";
    }
    titleCard.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    dash.appendChild(projDiv);

    PubSub.publish("New Project", "New Project");
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
    PubSub.publish("RemoveProject", nameOfProject);
  }

  function showContent() {
    const pTags = document.querySelectorAll("p");
    for (const tag of pTags) {
      tag.parentNode.style.backgroundColor = "inherit";
      tag.parentNode.dataset.active = null;
    }
    const h1Tags = document.querySelectorAll("h1");
    for (const tag of h1Tags) {
      tag.parentNode.style.backgroundColor = "inherit";
      tag.parentNode.dataset.active = null;
    }

    let project = 0;
    let subProject = 0;
    if (this.firstChild.dataset.elementType == "p") {
      // Get Project Tree
      project = this.firstChild.dataset.project;
      subProject = this.firstChild.dataset.subproject;
    } else {
      project = this.firstChild.textContent;
    }

    this.dataset.active = "true";
    PubSub.publish("Project Clicked", project, subProject);
    this.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  }

  init();
});
