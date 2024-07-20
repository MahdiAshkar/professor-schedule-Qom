const { Router } = require("express");
const professorRouter = require("./professor/professor.routes");
const scheduleRouter = require("./schedule/schedule.routes");

const mainRouter = Router();
mainRouter.use("/professor", professorRouter);
mainRouter.use("/schedule", scheduleRouter);
module.exports = mainRouter;
