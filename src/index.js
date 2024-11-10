import "./css/style.css";
import dashboard from "./dashboard.js";

(function () {
  localStorage.data = JSON.stringify({
    Projects: {
      p1: {
        sp1: {
          todo1: {
            title: "Complete project proposal",
            description:
              "Draft and finalize the project proposal for the new client",
            date: "2024-11-15",
            done: false,
            priority: "High",
          },
          todo2: {
            title: "Schedule team meeting",
            description: "Arrange a team meeting to discuss project milestones",
            date: "2024-11-10",
            done: false,
            priority: "Medium",
          },
          todo3: {
            title: "Review budget",
            description:
              "Go through the project budget and identify any potential issues",
            date: "2024-11-20",
            done: false,
            priority: "High",
          },
        },
        sp2: {
          todo1: {
            title: "Update client documentation",
            description:
              "Revise and update the client documentation with recent changes",
            date: "2024-11-25",
            done: false,
            priority: "Medium",
          },
          todo2: {
            title: "Prepare presentation slides",
            description: "Create slides for the upcoming client presentation",
            date: "2024-11-18",
            done: false,
            priority: "High",
          },
        },
      },
      p2: {
        sp1: {
          todo1: {
            title: "Conduct market research",
            description: "Perform market analysis for the new product line",
            date: "2024-12-05",
            done: false,
            priority: "High",
          },
          todo2: {
            title: "Draft marketing strategy",
            description:
              "Outline the marketing strategy based on research findings",
            date: "2024-12-10",
            done: false,
            priority: "Medium",
          },
        },
      },
      p3: {
        sp1: {
          todo1: {
            title: "Set up development environment",
            description:
              "Configure the development environment for the new project",
            date: "2024-11-12",
            done: false,
            priority: "High",
          },
          todo2: {
            title: "Code review",
            description:
              "Perform a code review of the latest feature implementation",
            date: "2024-11-14",
            done: false,
            priority: "Medium",
          },
          todo3: {
            title: "Write unit tests",
            description: "Develop unit tests for the core functionality",
            date: "2024-11-16",
            done: false,
            priority: "High",
          },
        },
      },
    },
  });

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
