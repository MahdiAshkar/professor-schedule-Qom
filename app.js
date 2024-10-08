const path = require("path");
const http = require("http");

const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const socketIo = require("socket.io");

const swaggerConfig = require("./config/swagger");
const mainRouter = require("./module/app.routes");
const notFoundHandler = require("./exception/notFound.handler");
const allExceptionHandler = require("./exception/allException.handler");
const cors = require("cors");
const chatRoomModel = require("./module/messages/chatRoom.model");

const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

dotenv.config({ path: path.join("config", ".env") });
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("connect");
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
  socket.on(
    "joinPrivateChat",
    async ({ studentId, professorId, isStudent }) => {
      const roomId = `${studentId}-${professorId}`;

      let chatRoom = await chatRoomModel.findOne({ roomId });
      if (!chatRoom) {
        if (isStudent) {
          chatRoom = new chatRoomModel({
            roomId,
            studentId,
            professorId,
            status: 0,
          });
          await chatRoom.save();
        }
      }

      socket.join(roomId);

      socket.emit("previousMessages", chatRoom.messages);

      socket.on("sendMessage", async (messageData) => {
        if (isStudent === "true" && chatRoom.messages.length >= 15) {
          socket.emit(
            "messages-overflow",
            "پیام ها بیش از 15 تا  شده است بسته می شود"
          );
        } else {
          chatRoom.messages.push({
            senderId: messageData.senderId,
            user: messageData.user,
            content: messageData.content,
            time: messageData.time,
          });
          await chatRoom.save();
          io.to(roomId).emit("receiveMessage", messageData);
        }
        if (isStudent !== "true") {
          chatRoom.status = true;
          await chatRoom.save();
        } else {
          chatRoom.status = false;
          await chatRoom.save();
        }
      });
    }
  );
});
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
server.listen(port, console.log(`server:http://localhost:${port}`));
