const { model, Schema, Types } = require("mongoose");

const chatRoomSchema = new Schema(
  {
    //  type: Types.ObjectId, ref: "professor"
    roomId: { type: String, required: true, unique: true },
    studentId: { type: Types.ObjectId, ref: "student", required: true },
    professorId: { type: Types.ObjectId, ref: "professor", required: true },
    status: { type: Boolean, required: true },
    messages: [
      {
        senderId: { type: String, required: true },
        user: { type: String, enum: ["professor", "student"] },
        content: { type: String, required: true },
        time: { type: String, default: new Date().toLocaleTimeString() },
      },
    ],
  },
  { timestamps: true }
);

const ChatRoom = model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
