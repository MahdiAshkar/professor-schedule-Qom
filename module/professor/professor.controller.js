const createHttpError = require("http-errors");
const ProfessorModel = require("./professor.model");
const ScheduleModel = require("../schedule/schedule.model");
const autoBind = require("auto-bind");
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
class ProfessorController {
  #scheduleModel;
  #professorModel;
  constructor() {
    autoBind(this);
    this.#scheduleModel = ScheduleModel;
    this.#professorModel = ProfessorModel;
  }

  async register(req, res, next) {
    try {
      const { name, username, password, email, phone_office, group, rank } =
        req.body;
      let image_profile = "/uploads/" + req?.file?.filename;
      if (!req?.file) image_profile = "/images/avatar_profile.jpg";
      const existingProfessor = await this.#professorModel.findOne({
        username,
      });

      if (existingProfessor) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newProfessor = new this.#professorModel({
        name,
        username,
        password: hashedPassword,
        email,
        phone_office,
        image_profile,
        group,
        rank,
      });

      await newProfessor.save();
      res.status(201).json({ message: "Professor registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const professor = await this.#professorModel.findOne({ username });

      if (!professor) {
        return res.status(401).json({ message: "not found professor" });
      }

      const isMatch = await bcrypt.compare(password, professor.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "نام کاربری یا رمز عبور اشتباه است!" });
      }
      const token = jwt.sign(
        { id: professor._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "6h" }
      );
      delete professor.password;
      delete professor.username;
      req.professor = professor;
      res
        .cookie("access_token", token, { httpOnly: true, secure: false })
        .status(200)
        .json({ message: "success login", token, id: professor._id });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("access_token").status(200).json({
        message: "log out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProfessor(req, res, next) {
    try {
      const {
        newName,
        newUsername,
        newPassword,
        newEmail,
        newRank,
        newGroup,
        newPhoneOffice,
        email,
      } = req.body;
      let image_profile = "/uploads/" + req?.file?.filename;
      if (!req?.file) image_profile = "/images/avatar_profile.jpg";

      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "6h",
      });
      const newHashedPassword = await bcrypt.hash(newPassword, 12);
      const pendingUpdate = {
        name: newName,
        username: newUsername,
        email: newEmail,
        password: newHashedPassword,
        image_profile,
        rank: newRank,
        group: newGroup,
        phone_office: newPhoneOffice,
      };

      const professor = await this.#professorModel.findOneAndUpdate(
        { email: email },
        { pendingUpdate: pendingUpdate, updateToken: token },
        { new: true }
      );

      if (!professor) {
        return res.status(404).json({ message: "professor not found" });
      }

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.PASSWORD_EMAIL,
        },
      });
      const templatePath = path.join(__dirname, "templateEmail.html");
      let htmlTemplate = fs.readFileSync(templatePath, "utf8");

      const name = professor.name;
      const confirmationLink = `http://localhost:3000/professor/confirm-update/${token}`;
      htmlTemplate = htmlTemplate.replace("{{username}}", name);
      htmlTemplate = htmlTemplate.replace(
        "{{confirmationLink}}",
        confirmationLink
      );
      const mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "تایید ایمیل برای تغییرات ",
        html: htmlTemplate,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email", error);
          return res
            .status(500)
            .json({ message: "Failed to send confirmation email" });
        }
        console.log("Email sent", info.response);
        res
          .status(200)
          .json({ message: "Confirmation email sent successfully" });
      });
    } catch (error) {
      console.error("Error requesting account update", error);
      res.status(500).json({ message: "Failed to request account update" });
    }
  }

  async confirmToken(req, res, next) {
    try {
      const { token } = req.params;
      const professor = await this.#professorModel.findOne({
        updateToken: token,
      });
      if (!professor) {
        return res
          .status(400)
          .json({ message: "Invalid token or user not found" });
      }

      professor.name = professor.pendingUpdate.name;
      professor.email = professor.pendingUpdate.email;
      professor.username = professor.pendingUpdate.username;
      professor.password = professor.pendingUpdate.password;
      professor.image_profile = professor.pendingUpdate.image_profile;
      professor.rank = professor.pendingUpdate.rank;
      professor.group = professor.pendingUpdate.group;
      professor.phone_office = professor.pendingUpdate.phone_office;
      professor.pendingUpdate = null;
      professor.updateToken = null;

      await professor.save();
      const templatePath = path.join(__dirname, "verified.html");
      let verifiedTemplate = fs.readFileSync(templatePath, "utf8");
      homeLink = "http://localhost:3000/professor/login";
      htmlTemplate = htmlTemplate.replace("{{backToLogin}}", homeLink);
      res.status(200).send(verifiedTemplate);
    } catch (error) {
      console.error("Error confirming account update", error);
      res.status(500).json({ message: "Failed to confirm account update" });
    }
  }
  async search(req, res, next) {
    try {
      const { query } = req.query;
      const professors = await this.#professorModel
        .find({ name: new RegExp(query, "i") })
        .lean();

      res.status(200).json(professors);
    } catch (error) {
      next(error);
    }
  }

  async getAllProfessor(req, res, next) {
    try {
      const professors = await this.#professorModel.find().lean();
      res.status(200).json(professors);
    } catch (error) {
      next(error);
    }
  }

  async createSchedule(req, res, next) {
    try {
      const { days, academicYear, term } = req.body;
      const professor = req.professor;
      const prof = await this.#professorModel.findById(professor._id);
      if (!prof)
        return res.status(401).json({ message: "not found professor" });
      const schedule = await this.#scheduleModel.find({ academicYear, term });
      if (schedule.length > 0) {
        return res.status(400).json({
          message:
            " جدول دراین ترم یا سال تحصیلی وجود دارد برای تغییر دوباره  ترم یا سال تحصیلی انتخاب کنید",
        });
      } else {
        await this.#scheduleModel.create({
          professor_id: professor._id,
          days,
          academicYear,
          term,
        });
      }
      res.status(201).json({ message: "Schedule created successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateSchedule(req, res, next) {
    try {
      const { idSchedule } = req.params;
      const { days } = req.body;
      const schedule = await this.#scheduleModel.findById(idSchedule);
      if (days.length > 7)
        return res.status(401).json({ message: "days > 7 " });
      if (!schedule)
        return res
          .status(401)
          .json({ message: "not found schedule in controller" });
      const updatedSchedule = await this.#scheduleModel.findByIdAndUpdate(
        idSchedule,
        { $set: { days: days } },
        { new: true }
      );

      if (!updatedSchedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      res.status(200).json({ message: "Schedule updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getProfessorById(req, res, next) {
    try {
      const { id } = req.params;
      const professor = await this.#professorModel.findById(id).lean();

      if (!professor) {
        return res.status(404).json({ message: "Professor not found" });
      }

      res.status(200).json(professor);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfessorController();
