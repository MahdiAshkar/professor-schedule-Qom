const { Schema, model } = require("mongoose");

const ProfessorSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, default: "qom@example.com", unique: true },
  image_profile: { type: String },
  phone_office: { type: String, default: "025-00000000" },
  group: { type: String, required: true },
  rank: { type: String, required: true },
  pendingUpdate: { type: Object, default: null },
  updateToken: { type: String, default: null },
});
const ProfessorModel = model("professor", ProfessorSchema);
module.exports = ProfessorModel;
