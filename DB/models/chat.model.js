import { Schema, model } from "mongoose";


const chatSchema = new Schema({
    chatName: { type: String, required: true },
    isGroup: { type: Boolean, required: true, default: false },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'user' },
    users: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'message' }
}, { timestamps: true })


const Chat = model('chat',chatSchema)

export default Chat