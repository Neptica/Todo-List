import check from "./svg/check.svg";
import plus from "./svg/plus.svg";
import setting from "./svg/tune.svg";

export default (function (projects) {
  function init() {
    renderDashboard();
    renderTaskDash();
  }

  function renderDashboard() {
    const dash = document.getElementById("dashboard");
    dash.innerHTML = "";

    for (const [project, indProject] of Object.entries(projects)) {
      const projDiv = document.createElement("div");

      projDiv.classList.add("proj");
      const titleCard = document.createElement("div");
      const projTitle = document.createElement("h1");
      const addMore = document.createElement("img");

      addMore.src = plus;
      addMore.addEventListener("click", insertInputNode);
      projTitle.textContent = project;
      projTitle.dataset.elementType = "h1";
      projTitle.addEventListener("dblclick", changeTextToInput);
      titleCard.classList.add("titleCard");

      titleCard.appendChild(projTitle);
      titleCard.appendChild(addMore);
      projDiv.appendChild(titleCard);

      for (const [iProject, values] of Object.entries(indProject)) {
        const iProjDiv = document.createElement("p");
        iProjDiv.textContent = iProject;
        iProjDiv.dataset.elementType = "p";
        iProjDiv.addEventListener("dblclick", changeTextToInput);
        projDiv.appendChild(iProjDiv);
      }
      dash.appendChild(projDiv);
    }
  }

  function insertInputNode() {
    const projInput = document.createElement("input");
    projInput.classList.add("indProj");
    projInput.dataset.elementType = "p";

    projInput.addEventListener("focusout", convertBack);

    this.parentNode.after(projInput);

    projInput.focus(); // this makes it focus nicely
  }

  function changeTextToInput() {
    let currentTitle = this.textContent;

    const projInput = document.createElement("input");
    projInput.classList.add("renameProj");
    projInput.style.fontSize = getComputedStyle(this).fontSize;
    projInput.style.fontWeight = getComputedStyle(this).fontWeight;
    projInput.value = currentTitle;
    projInput.dataset.elementType = this.dataset.elementType;
    projInput.dataset.oldText = currentTitle;
    if (projInput.dataset.elementType == "p")
      projInput.classList.add("indProj");

    projInput.addEventListener("focusout", convertBack);
    projInput.addEventListener("keydown", function (event) {
      if (event.key == "Enter") {
        event.preventDefault();
        convertBack.call(projInput);
      }
    });
    this.parentNode.replaceChild(projInput, this);

    projInput.focus(); // this makes it focus nicely
  }

  function convertBack() {
    const parent = this.parentNode;
    let currentTitle = this.value;
    if (currentTitle == "") {
      if (typeof this.dataset.oldText === "undefined") {
        this.parentNode.removeChild(this);
        return;
      }

      console.log(this.dataset.oldText);
      currentTitle = this.dataset.oldText;
    }
    if (!parent.contains(this)) return;

    const currentType = this.dataset.elementType;

    const projTitle = document.createElement(currentType);

    projTitle.textContent = currentTitle;
    projTitle.dataset.elementType = this.dataset.elementType;
    projTitle.addEventListener("dblclick", changeTextToInput);
    this.parentNode.replaceChild(projTitle, this);
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
    settings.addEventListener("click", displayRemoveButtons);

    newCard.appendChild(add);
    newCard.appendChild(newList);
    newCard.style.cursor = "pointer";
    newCard.addEventListener("click", newProject);

    taskControl.appendChild(newCard);
    taskControl.appendChild(settings);
  }

  function newProject() {
    console.log("hi");
  }

  function displayRemoveButtons() {
    console.log("Hi");
  }

  init();
});
