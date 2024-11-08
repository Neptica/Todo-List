import check from "./svg/check.svg";
import plus from "./svg/plus.svg";

export default (function (projects) {
  function init() {
    renderDashboard();
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
      addMore.addEventListener("click", insertInput);
      projTitle.textContent = project;
      projTitle.dataset.elementType = "h1";
      projTitle.addEventListener("dblclick", changeToInput);
      titleCard.classList.add("titleCard");

      titleCard.appendChild(projTitle);
      titleCard.appendChild(addMore);
      projDiv.appendChild(titleCard);

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

  function insertInput() {
    const projInput = document.createElement("input");
    projInput.classList.add("indProj");
    projInput.dataset.elementType = "p";

    projInput.addEventListener("focusout", convertBack);
    projInput.addEventListener("keypress", function (event) {
      if (event.key == "Enter") convertBack.call(projInput);
    });

    this.parentNode.after(projInput);

    projInput.focus(); // this makes it focus nicely
  }

  function changeToInput() {
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
    projInput.addEventListener("keypress", function (event) {
      if (event.key == "Enter") convertBack.call(projInput);
    });
    this.parentNode.replaceChild(projInput, this);

    projInput.focus(); // this makes it focus nicely
  }

  function convertBack() {
    let currentTitle = this.value;
    if (currentTitle == "") {
      if (typeof this.dataset.oldText === "undefined") {
        this.parentNode.removeChild(this);
        return;
      }

      console.log(this.dataset.oldText);
      currentTitle = this.dataset.oldText;
    }

    const currentType = this.dataset.elementType;

    const projTitle = document.createElement(currentType);

    projTitle.textContent = currentTitle;
    projTitle.dataset.elementType = this.dataset.elementType;
    projTitle.addEventListener("dblclick", changeToInput);
    this.parentNode.replaceChild(projTitle, this);
  }

  init();
});
