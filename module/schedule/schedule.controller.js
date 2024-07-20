const createHttpError = require("http-errors");
const ProfessorModel = require("../professor/professor.model");
const ScheduleModel = require("./schedule.model");
const autoBind = require("auto-bind");
const { mongoose } = require("mongoose");

class ScheduleController {
  #scheduleModel;
  constructor() {
    autoBind(this);
    this.#scheduleModel = ScheduleModel;
  }

  async getScheduleByName(req, res, next) {
    try {
      const { name } = req.params;
      const schedule = await this.#scheduleModel
        .findOne({ name_professor: name }, { _id: 0 })
        .populate("professor_id")
        .lean();

      if (!schedule)
        return res.status(404).json({ message: "not found schedule" });
      delete schedule.professor_id._id;
      delete schedule.professor_id.password;
      delete schedule.professor_id.username;
      res.status(200).json(schedule);
    } catch (err) {
      next(err);
    }
  }
  async getScheduleById(req, res, next) {
    try {
      const { id } = req.params;
      const schedule = await this.#scheduleModel.findOne({ _id: id }).lean();

      if (!schedule)
        return res.status(404).json({ message: "not found schedule" });
      return res.status(200).json(schedule);
    } catch (err) {
      next(err);
    }
  }
  async getLatestSchedule(req, res, next) {
    try {
      let { id } = req.params;
      const _id = new mongoose.Types.ObjectId(id);
      const latestSchedule = await this.#scheduleModel.aggregate([
        { $match: { professor_id: _id } },
        { $sort: { academicYear: -1, term: -1 } },
        { $limit: 1 },
      ]);

      if (!latestSchedule.length) {
        return res.status(404).json({ message: "No schedule found" });
      }
      res.json(latestSchedule);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching latest schedule", error });
    }
  }
  async getIdSchedule(req, res, next) {
    try {
      const { id, term, academicYear } = req.params;
      const schedule = await this.#scheduleModel
        .findOne({ professor_id: id, term, academicYear })
        .lean();

      if (!schedule)
        return res.status(404).json({ message: "not found schedule" });
      return res.status(200).json(schedule._id);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ScheduleController();
