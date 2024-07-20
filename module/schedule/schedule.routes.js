const { Router } = require("express");
const scheduleController = require("./schedule.controller");

const scheduleRouter = Router();

scheduleRouter.get("/latest/:id", scheduleController.getLatestSchedule);
scheduleRouter.get("/search/:name", scheduleController.getScheduleByName);
scheduleRouter.get("/:id", scheduleController.getScheduleById);
scheduleRouter.get(
  "/:id/:term/:academicYear",
  scheduleController.getIdSchedule
);
module.exports = scheduleRouter;
