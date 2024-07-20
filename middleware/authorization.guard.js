const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const ProfessorModel = require("../module/professor/professor.model");
require("dotenv").config();
const authorization = async (req, res, next) => {
  try {
    const token = req?.cookies?.access_token;
    if (!token)
      throw new createHttpError.Unauthorized(
        "Not authorization please Login your account"
      );

    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (data?.id) {
      const professor = await ProfessorModel.findById(data.id);
      if (!professor)
        throw new createHttpError.Unauthorized("not found account");
      req.professor = professor;
      return next();
    }
    throw new createHttpError.Unauthorized("invalid token");
  } catch (err) {
    next(err);
  }
};
module.exports = authorization;
