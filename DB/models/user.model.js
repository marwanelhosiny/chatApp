import { Schema, model } from "mongoose";




const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
         type: String, default:"https://res.cloudinary.com/dt01aqi78/image/upload/v1710101917/chatApp/users/79gg71/izs59ppb98os4vq6elbs.jpg"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
},{timestamps: true})


const User = model('user',userSchema)

export default User