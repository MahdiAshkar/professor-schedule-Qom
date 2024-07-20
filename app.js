const path = require("path");

const express = require("express");
const dotenv = require("dotenv");

const swaggerConfig = require("./config/swagger");
const mainRouter = require("./module/app.routes");
const notFoundHandler = require("./exception/notFound.handler");
const allExceptionHandler = require("./exception/allException.handler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:8080",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

dotenv.config({ path: path.join("config", ".env") });
const app = express();
const port = process.env.PORT;
app.use(express.static("public"));
app.use(cors(corsOptions));
require("./config/mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(mainRouter);
swaggerConfig(app);
notFoundHandler(app);
allExceptionHandler(app);
app.listen(port, console.log(`server:http://localhost:${port}`));
