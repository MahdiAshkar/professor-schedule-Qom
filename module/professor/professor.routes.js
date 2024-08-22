const { Router } = require("express");
const professorController = require("./professor.controller");
const authorization = require("../../middleware/authorization.guard");
const upload = require("../../middleware/uploadMulter");

const professorRouter = Router();

professorRouter.post(
  "/register",
  upload.single("photo"),
  professorController.register
);

professorRouter.put(
  "/update",
  authorization,
  upload.single("newPhoto"),
  professorController.updateProfessor
);
professorRouter.get("/confirm-update/:token", professorController.confirmToken);
professorRouter.get(
  "/conversations/:id",
  professorController.getInfoConversation
);
professorRouter.post("/login", professorController.login);
professorRouter.get("/logout", professorController.logout);
professorRouter.get("/search", professorController.search);
professorRouter.get("/all", professorController.getAllProfessor);
professorRouter.post(
  "/create-schedule",
  authorization,
  professorController.createSchedule
);
professorRouter.put(
  "/update-schedule/:idSchedule",
  authorization,
  professorController.updateSchedule
);
professorRouter.get(
  "/:id",

  professorController.getProfessorById
);

module.exports = professorRouter;
