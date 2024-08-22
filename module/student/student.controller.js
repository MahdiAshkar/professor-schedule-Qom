const createHttpError = require("http-errors");
const autoBind = require("auto-bind");
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const path = require("path");

const ProfessorModel = require("../professor/professor.model");
const StudentModel = require("./student.model");
const ChatRoomModel = require("../messages/chatRoom.model");

class StudentController {
  #professorModel;
  #studentModel;
  #chatRoomModel;
  constructor() {
    autoBind(this);
    this.#professorModel = ProfessorModel;
    this.#studentModel = StudentModel;
    this.#chatRoomModel = ChatRoomModel;
  }

  async register(req, res, next) {
    try {
      const { name, studentNumber, password } = req.body;
      let image = "/uploads/" + req?.file?.filename;
      if (!req?.file) image = "/images/avatar_profile.jpg";

      const hashedPassword = await bcrypt.hash(password, 12);

      const newStudent = new this.#studentModel({
        name,
        studentNumber,
        password: hashedPassword,
        image,
      });

      await newStudent.save();
      res.status(201).json({ message: "student registered successfully" });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { name, password, studentNumber } = req.body;
      let image = "/uploads/" + req?.file?.filename;
      if (!req?.file) image = "/images/avatar_profile.jpg";
      const newPassword = await bcrypt.hash(password, 12);
      const student = await this.#studentModel.findOneAndUpdate(
        { studentNumber },
        { name, password: newPassword, image },
        { new: true }
      );
      if (!student) {
        return res
          .status(400)
          .json({ message: "not found student for Edit info" });
      }

      return res.status(200).json({ message: "success edit info student" });
    } catch (error) {
      next(error);
    }
  }
  async getInfoConversation(req, res, next) {
    try {
      let { id } = req.params;
      const student = await this.#studentModel.findById(id);
      if (student) {
        const _id = new mongoose.Types.ObjectId(id);
        const listConversation = await this.#chatRoomModel
          .find({
            studentId: _id,
          })
          .populate("studentId", {
            name: 1,
            studentNumber: 1,
            image: 1,
            _id: 1,
          })
          .populate("professorId", { name: 1, image_profile: 1, _id: 1 });
        res.status(200).json(listConversation);
      } else {
        throw new Error("not found student id for info conversation");
      }
    } catch (error) {
      next(error);
    }
  }
  async getInfo(req, res, next) {
    try {
      const { id } = req.params;
      const student = await this.#studentModel.findById(id, {
        password: 0,
        __v: 0,
      });
      if (!student) {
        return res.status(404).json({ message: "not found student by id" });
      }
      return res.status(200).json(student);
    } catch (error) {
      next();
    }
  }
  async login(req, res, next) {
    try {
      const { studentNumber, password } = req.body;
      const student = await this.#studentModel.findOne({ studentNumber });

      if (!student) {
        return res
          .status(401)
          .json({ message: "شماره دانشجویی یا رمز عبور اشتباه است!" });
      }

      const isMatchPassword = await bcrypt.compare(password, student.password);
      if (!isMatchPassword) {
        return res
          .status(401)
          .json({ message: "شماره دانشجویی یا رمز عبور اشتباه است!" });
      }

      const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "6h",
      });
      delete student.password;
      req.student = student;
      res
        .cookie("student_token", token, { httpOnly: true, secure: false })
        .status(200)
        .json({ message: "success login", token, id: student._id });
    } catch (error) {
      next(error);
    }
  }

  async checkToken(req, res, next) {
    try {
      const { token } = req.params;
      const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (data?.id) {
        const student = await this.#studentModel.findById(data.id, {
          password: 0,
          studentNumber: 0,
        });
        if (!student)
          throw new createHttpError.Unauthorized("not found student");
        return res.status(200).json(student);
      }
      throw new createHttpError.Unauthorized("invalid token");
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("student_token").status(200).json({
        message: "log out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
