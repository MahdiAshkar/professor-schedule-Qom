const { Router } = require("express");
const studentController = require("./student.controller");
const upload = require("../../middleware/uploadMulter");
const authorizationStudent = require("../../middleware/authorizationStudent.guard");

const studentRouter = Router();
studentRouter.post("/login", studentController.login);
studentRouter.post(
  "/register",
  upload.single("image"),
  studentController.register
);
studentRouter.get("/info/:id", studentController.getInfo);
studentRouter.get("/conversations/:id", studentController.getInfoConversation);
studentRouter.get("/checkToken/:token", studentController.checkToken);
studentRouter.put("/update", upload.single("image"), studentController.update);
studentRouter.get("/logout", studentController.logout);
module.exports = studentRouter;
