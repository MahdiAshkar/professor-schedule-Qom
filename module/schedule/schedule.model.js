const { Schema, Types, model } = require("mongoose");

const timeSlotSchema = new Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    task: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { _id: false }
);

const dayScheduleSchema = new Schema(
  {
    day: {
      type: String,
      enum: ["شنبه", "یکشنبه", "دو‌شنبه", "سه‌شنبه", "چهار‌شنبه", "پنج‌شنبه"],
      required: true,
    },
    timeSlots: [timeSlotSchema],
  },
  { _id: false }
);
const ScheduleSchema = new Schema({
  professor_id: { type: Types.ObjectId, ref: "professor", required: true },
  days: [dayScheduleSchema],
  academicYear: { type: Number },
  term: { type: Number },
});
const ScheduleModel = model("schedule", ScheduleSchema);
module.exports = ScheduleModel;
