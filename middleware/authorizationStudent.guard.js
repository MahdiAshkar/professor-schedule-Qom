const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const StudentModel = require("../module/student/student.model");
require("dotenv").config();
const authorizationStudent = async (req, res, next) => {
  try {
    const token = req?.cookies?.student_token;
    if (!token)
      throw new createHttpError.Unauthorized(
        "Not authorization please Login your account"
      );

    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (data?.id) {
      const student = await StudentModel.findById(data.id);
      if (!student) throw new createHttpError.Unauthorized("not found student");
      req.student = student;
      return next();
    }
    throw new createHttpError.Unauthorized("invalid token");
  } catch (err) {
    next(err);
  }
};
module.exports = authorizationStudent;
