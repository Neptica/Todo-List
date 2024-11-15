import PubSub, { getObject, setObject } from "./index.js";
import close from "./svg/close-circle.svg";

export default (function () {
  // Takes the Object being operated on, the project name, and the subtitle name as arguments, from which paths will be constructed
  let isHome = null;
  let currentProject = null;
  let currentSubProject = null;

  function render(title, subtitle = null, keepWorkspace = false) {
    const contentDiv = document.getElementById("workspace");
    const allProjCard = document.createElement("div");
    allProjCard.classList.add("allProj");

    if (!keepWorkspace) {
      contentDiv.innerHTML = "";
      isHome = null;
    } else {
      isHome = true;
      currentProject = null;
      currentSubProject = null;
    }
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
      if (!isHome) currentProject = title;
      currentSubProject = null;
      const projDiv = document.createElement("div");
      projDiv.classList.add("pDiv");
      const projName = document.createElement("h1");
      projName.addEventListener("dblclick", changeToInput);
      projName.textContent = title;
      projName.dataset.project = title;
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
    renderHome();
  });

  PubSub.subscribe("New Todo", function () {
    const contentDiv = document.getElementById("workspace");
    const distFromTop = contentDiv.scrollTop;
    if (isHome) {
      renderHome();
    } else {
      render(currentProject, currentSubProject);
    }
    contentDiv.scrollTop = distFromTop;
  });

  function renderHome() {
    const projects = getObject().Projects;
    const contentDiv = document.getElementById("workspace");
    contentDiv.innerHTML = "";
    for (const [title] of Object.entries(projects)) {
      render(title, null, true);
    }
  }

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
        if (name === "done") {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.dataset.project = projectTitle;
          checkbox.dataset.subProject = subProjectTitle;
          checkbox.dataset.todo = todo;
          checkbox.checked = value;
          checkbox.addEventListener("click", updateCheckbox);
          checkbox.classList.add("checkbox");
          todoDiv.appendChild(checkbox);
        } else if (name === "priority") {
          const dropDown = document.createElement("select");
          dropDown.dataset.project = projectTitle;
          dropDown.dataset.subProject = subProjectTitle;
          dropDown.dataset.todo = todo;
          todoDiv.appendChild(dropDown);
          dropDown.addEventListener("change", changePriority);
          dropDown.classList.add("priority-dropdown");

          const values = ["None", "High", "Medium", "Low"];
          for (let i = 0; i < values.length; i++) {
            const option = document.createElement("option");
            option.textContent = values[i];
            option.value = values[i];
            if (values[i] === value) option.selected = true;
            dropDown.appendChild(option);
          }
        } else {
          const p = document.createElement("p");
          p.dataset.project = projectTitle;
          p.dataset.subProject = subProjectTitle;
          p.dataset.todo = todo;
          p.dataset.property = name;
          p.textContent = value;
          p.addEventListener("dblclick", changeToInput);
          todoDiv.appendChild(p);
        }
      }
      const deleteButton = document.createElement("img");
      deleteButton.src = close;
      deleteButton.style.cssText = "width: 20px; height: 20px;";
      deleteButton.dataset.project = projectTitle;
      deleteButton.dataset.subProject = subProjectTitle;
      deleteButton.dataset.todo = todo;
      deleteButton.addEventListener("click", removeTodo);
      todoDiv.appendChild(deleteButton);
      projectCard.appendChild(todoDiv);
    }
    const button = document.createElement("button");
    button.textContent = "+";
    button.classList.add("subProjAdd");
    button.dataset.project = projectTitle;
    button.dataset.subProject = subProjectTitle;
    button.addEventListener("click", createNewTodo);
    projectCard.appendChild(button);

    updateBottomMargin(projectCard);
  }

  function changeToInput() {
    const inputBox = document.createElement("input");
    inputBox.classList.add("clearBox");
    const elementType = this.nodeName;
    const project = this.dataset.project;
    const subProject = this.dataset.subProject;
    const todo = this.dataset.todo;
    const property = this.dataset.property;
    inputBox.dataset.elementType = elementType;
    inputBox.dataset.project = project;
    inputBox.dataset.subProject = subProject;
    inputBox.dataset.todo = todo;
    inputBox.dataset.property = property;
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
    const todo = this.dataset.todo;
    const property = this.dataset.property;
    let newName = this.value;
    if (newName == "") newName = this.dataset.oldText;

    const projects = getObject().Projects;
    const replacementText = document.createElement(elementType);
    replacementText.addEventListener("dblclick", changeToInput);

    // will edit the other later
    replacementText.dataset.elementType = elementType;
    replacementText.dataset.project = project;
    replacementText.dataset.subProject = subProject;
    replacementText.dataset.todo = todo;
    replacementText.dataset.property = property;

    let write = true;
    console.log(subProject, this.dataset.oldText);
    if (todo != "undefined" && newName != this.dataset.oldText) {
      projects[project][subProject][todo][property] = newName;
    } else if (
      subProject != "undefined" &&
      subProject == this.dataset.oldText &&
      typeof projects[project][newName] == "undefined"
    ) {
      if (newName != this.dataset.oldText) {
        projects[project][newName] = projects[project][subProject];
        delete projects[project][subProject];
        const h1Tags =
          this.parentNode.parentNode.querySelectorAll("p, input, select");
        for (const tag of h1Tags) tag.dataset.project = newName; // Update todo links
      }
      replacementText.dataset.project = project;
      replacementText.dataset.subProject = newName;
    } else if (typeof projects[newName] == "undefined") {
      if (newName != this.dataset.oldText) {
        projects[newName] = projects[project];
        delete projects[project];
      }
      const h1Tags = this.parentNode.parentNode.querySelectorAll(
        "h1, p, input, select",
      );
      for (const tag of h1Tags) tag.dataset.project = newName; // Update subprojects project link
      replacementText.dataset.project = newName;
    } else {
      replacementText.textContent = this.dataset.oldText;
      write = false;
    }

    if (write) {
      replacementText.textContent = newName;
      setObject(projects);
      console.log(getObject().Projects);
      PubSub.publish("Project Change", newName); // newName to make sure proper element is selected if Home isn't
    }
    this.parentNode.replaceChild(replacementText, this);
  }

  function updateCheckbox() {
    const project = this.dataset.project;
    const subProject = this.dataset.subProject;
    const todo = this.dataset.todo;
    const value = this.checked;
    const projectsObject = getObject().Projects;
    projectsObject[project][subProject][todo].done = value;
    setObject(projectsObject);
  }

  function changePriority() {
    const project = this.dataset.project;
    const subProject = this.dataset.subProject;
    const todo = this.dataset.todo;
    const value = this.value;

    const projectsObject = getObject().Projects;
    projectsObject[project][subProject][todo].priority = value;
    setObject(projectsObject);
  }

  function createNewTodo() {
    const project = this.dataset.project;
    const subProject = this.dataset.subProject;
    const projectsObject = getObject().Projects;
    projectsObject[project][subProject]["New Todo"] = {
      title: "Title",
      description: "Description",
      date: "2024-11-12",
      done: false,
      priority: "None",
    };
    setObject(projectsObject);
    PubSub.publish("New Todo");
  }

  function removeTodo() {
    const project = this.dataset.project;
    const subProject = this.dataset.subProject;
    const todo = this.dataset.todo;
    const projectsObject = getObject().Projects;
    delete projectsObject[project][subProject][todo];
    console.log(projectsObject[project][subProject][todo]);
    setObject(projectsObject);
    this.parentNode.parentNode.removeChild(this.parentNode);
  }
});
