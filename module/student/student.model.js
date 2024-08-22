const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
  name: { type: String, require: true },
  studentNumber: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  image: { type: String },
});
const StudentModel = model("student", studentSchema);
module.exports = StudentModel;
