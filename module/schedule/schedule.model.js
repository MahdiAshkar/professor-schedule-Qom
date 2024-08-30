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
  academicYear: { type: Number, required: true },
  term: { type: Number, required: true },
});
const ScheduleModel = model("schedule", ScheduleSchema);
module.exports = ScheduleModel;

const ChatRoom = require("./models/ChatRoom");

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinPrivateChat", async ({ studentId, professorId }) => {
    const roomId = `${studentId}-${professorId}`;

    let chatRoom = await ChatRoom.findOne({ roomId });
    if (!chatRoom) {
      chatRoom = new ChatRoom({ roomId, studentId, professorId });
      await chatRoom.save();
    }

    socket.join(roomId);

    socket.emit("previousMessages", chatRoom.messages);
  });

  socket.on("sendMessage", async (messageData) => {
    const roomId = `${messageData.studentId}-${messageData.professorId}`;

    let chatRoom = await ChatRoom.findOne({ roomId });
    if (!chatRoom) {
      chatRoom = new ChatRoom({
        roomId,
        studentId: messageData.studentId,
        professorId: messageData.professorId,
      });
    }

    chatRoom.messages.push({
      senderId: messageData.senderId,
      content: messageData.content,
      time: messageData.time,
    });
    await chatRoom.save();

    io.to(roomId).emit("receiveMessage", {
      isSent: messageData.senderId === messageData.studentId,
      text: messageData.content,
      time: new Date(messageData.time).toLocaleTimeString(),
      avatar: "path/to/avatar.png",
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
