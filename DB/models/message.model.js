import { Schema, model } from "mongoose";




const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    chat:{
        type: Schema.Types.ObjectId,
        ref: "chat",
        required: true
    }

}, { timestamps: true })


const Message = model('message',messageSchema)

export default Message