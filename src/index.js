import "./css/style.css";
import dashboard from "./dashboard.js";
import content from "./maincontent.js";

const PubSub = {
  events: {},
  subscribe: function (eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  },

  publish: function (eventName, ...data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(...data));
    }
  },
};

export default PubSub;

export const getObject = () => {
  const data = localStorage.data;
  return JSON.parse(data);
};

export const setObject = (newData) => {
  const object = getObject();
  object.Projects = newData;
  localStorage.data = JSON.stringify(object);
};

(function () {
  // localStorage.data = JSON.stringify({
  //   Projects: {
  //     p1: {
  //       sp1: {
  //         todo1: {
  //           title: "Complete project proposal",
  //           description:
  //             "Draft and finalize the project proposal for the new client",
  //           date: "2024-11-15",
  //           done: false,
  //           priority: "High",
  //         },
  //         todo2: {
  //           title: "Schedule team meeting",
  //           description: "Arrange a team meeting to discuss project milestones",
  //           date: "2024-11-10",
  //           done: false,
  //           priority: "Medium",
  //         },
  //         todo3: {
  //           title: "Review budget",
  //           description:
  //             "Go through the project budget and identify any potential issues",
  //           date: "2024-11-20",
  //           done: false,
  //           priority: "High",
  //         },
  //       },
  //       sp2: {
  //         todo1: {
  //           title: "Update client documentation",
  //           description:
  //             "Revise and update the client documentation with recent changes",
  //           date: "2024-11-25",
  //           done: false,
  //           priority: "Medium",
  //         },
  //         todo2: {
  //           title: "Prepare presentation slides",
  //           description: "Create slides for the upcoming client presentation",
  //           date: "2024-11-18",
  //           done: false,
  //           priority: "High",
  //         },
  //       },
  //     },
  //     p2: {
  //       sp1: {
  //         todo1: {
  //           title: "Conduct market research",
  //           description: "Perform market analysis for the new product line",
  //           date: "2024-12-05",
  //           done: false,
  //           priority: "High",
  //         },
  //         todo2: {
  //           title: "Draft marketing strategy",
  //           description:
  //             "Outline the marketing strategy based on research findings",
  //           date: "2024-12-10",
  //           done: false,
  //           priority: "Medium",
  //         },
  //       },
  //     },
  //     p3: {
  //       sp1: {
  //         todo1: {
  //           title: "Set up development environment",
  //           description:
  //             "Configure the development environment for the new project",
  //           date: "2024-11-12",
  //           done: false,
  //           priority: "High",
  //         },
  //         todo2: {
  //           title: "Code review",
  //           description:
  //             "Perform a code review of the latest feature implementation",
  //           date: "2024-11-14",
  //           done: false,
  //           priority: "Medium",
  //         },
  //         todo3: {
  //           title: "Write unit tests",
  //           description: "Develop unit tests for the core functionality",
  //           date: "2024-11-16",
  //           done: false,
  //           priority: "High",
  //         },
  //       },
  //     },
  //   },
  // });

  // Start HTML Population
  dashboard();
  content();
})();
