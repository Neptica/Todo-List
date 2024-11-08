export default (function (projects) {
  function init() {
    renderDashboard();
  }

  function renderDashboard() {
    const dash = document.getElementById("dashboard");
    let eachProject = [];

    for (const [project, indProject] of Object.entries(projects)) {
      eachProject.push([project, 0]);
    }

    for (const [project, indProject] of Object.entries(projects)) {
      const projDiv = document.createElement("div");
      projDiv.classList.add("proj");
      const projTitle = document.createElement("h1");
      projTitle.textContent = project;
      projTitle.dataset.elementType = "h1";
      eachProject[project] = false;
      projTitle.addEventListener("dblclick", changeToInput);
      projDiv.appendChild(projTitle);

      for (const [iProject, values] of Object.entries(indProject)) {
        const iProjDiv = document.createElement("p");
        iProjDiv.textContent = iProject;
        iProjDiv.dataset.elementType = "p";
        iProjDiv.addEventListener("dblclick", changeToInput);
        projDiv.appendChild(iProjDiv);
      }
      dash.appendChild(projDiv);
    }
  }

  function changeToInput() {
    let currentTitle = this.textContent;

    const projInput = document.createElement("input");
    projInput.classList.add("renameProj");
    projInput.style.fontSize = getComputedStyle(this).fontSize;
    projInput.style.fontWeight = getComputedStyle(this).fontWeight;
    projInput.value = currentTitle;
    projInput.dataset.elementType = this.dataset.elementType;
    if (projInput.dataset.elementType == "p")
      projInput.classList.add("indProj");
    projInput.addEventListener("focusout", convertBack);
    projInput.addEventListener("keypress", function (event) {
      if (event.key == "Enter") convertBack.call(projInput);
    });
    this.parentNode.replaceChild(projInput, this);
  }

  function convertBack() {
    let currentTitle = this.value;
    const currentType = this.dataset.elementType;

    const projTitle = document.createElement(currentType);

    projTitle.textContent = currentTitle;
    projTitle.dataset.elementType = this.dataset.elementType;
    projTitle.addEventListener("dblclick", changeToInput);
    this.parentNode.replaceChild(projTitle, this);
  }

  init();
});
