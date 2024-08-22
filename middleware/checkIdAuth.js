const jwt = require("jsonwebtoken");

const checkId = (req, res, next) => {
  try {
    const { id, token } = req.params;
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (data?.id) {
      return res.status(200).json(id == data.id);
    }
    throw new createHttpError.Unauthorized("invalid token");
  } catch (error) {
    next(error);
  }
};
module.exports = checkId;
