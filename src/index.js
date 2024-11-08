import "./css/style.css";
import dashboard from "./dashboard.js";

(function () {
  let data = localStorage.data;
  let object = JSON.parse(data);

  for (const [todo, value] of Object.entries(object.Projects.p1.sp1.todo1)) {
    console.log(`${todo};${value}`);
  }

  console.log(object.Projects.p1.sp1.todo1);
  console.log("Hi");

  // Start HTML Population
  dashboard(object.Projects);
})();
