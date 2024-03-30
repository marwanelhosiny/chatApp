import mongoose from "mongoose";


const db_connection= async()=>{
    await mongoose.connect("mongodb+srv://elhosinymarwan29:0162105511@maro-1.udxzsgv.mongodb.net/chatApp")
    .then(()=>{console.log('db connected successfully')})
    .catch((err)=>{console.log("connection failed",err)})
}


export default db_connection