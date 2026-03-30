const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const module = {
  id: 1,
  title: "NodeJS Module",
  description: "All about NodeJS servers",
};

export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  app.get("/lab5/assignment", getAssignment);

  const getAssignmentTitle = (req, res) => {
    res.json(assignment.title);
  };
  app.get("/lab5/assignment/title", getAssignmentTitle);

  const setAssignmentTitle = (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  };
  app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);

  const getModule = (req, res) => {
    res.json(module);
  };
  app.get("/lab5/module", getModule);

  const getModuleTitle = (req, res) => {
    res.json(module.title);
  };
  app.get("/lab5/module/title", getModuleTitle);

  const setModuleTitle = (req, res) => {
    const { newTitle } = req.params;
    module.title = newTitle;
    res.json(module);
  };
  app.get("/lab5/module/title/:newTitle", setModuleTitle);

  const setModuleDescription = (req, res) => {
    const { newDescription } = req.params;
    module.description = newDescription;
    res.json(module);
  };
  app.get("/lab5/module/description/:newDescription", setModuleDescription);

  const setAssignmentScore = (req, res) => {
    const { newScore } = req.params;
    assignment.score = Number(newScore);
    res.json(assignment);
  };
  app.get("/lab5/assignment/score/:newScore", setAssignmentScore);

  const setAssignmentCompleted = (req, res) => {
    const { completed } = req.params;
    assignment.completed = completed === "true";
    res.json(assignment);
  };
  app.get("/lab5/assignment/completed/:completed", setAssignmentCompleted);
}
