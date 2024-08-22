const { Router } = require("express");
const professorRouter = require("./professor/professor.routes");
const scheduleRouter = require("./schedule/schedule.routes");
const studentRouter = require("./student/student.routes");
const checkId = require("../middleware/checkIdAuth");

const mainRouter = Router();
mainRouter.use("/professor", professorRouter);
mainRouter.use("/schedule", scheduleRouter);
mainRouter.use("/s", studentRouter);
mainRouter.get("/checkId/:id/:token", checkId);
module.exports = mainRouter;
