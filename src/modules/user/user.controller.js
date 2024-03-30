import User from "../../../DB/models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import generateUniequeString from "../../utils/generateUniqueString.js"
import axios from "axios"
import cloudinaryConnection from "../../utils/cloudinary.js"
import { ApiFeatures } from "../../utils/api-features.js"

//============================================== register api =======================================//
export const signUp = async (req, res, next) => {
    //destructing enteries from req
    const { name, email, password } = req.body

    //checking if email or mobilePhone duplicated
    const isExist = await User.findOne({ email })
    if (isExist) { return next(new Error('duplicated email', { cause: 400 })) }

    //hashing password before storing in database
    const hashedPass = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)

    //checking if sent pic
    let pic ;
    if (req.file) {
        const folderId = generateUniequeString(6)
        const { secure_url } = await cloudinaryConnection().uploader.upload(req.file.path, {
            folder: `chatApp/users/${folderId}`
        })
        pic =  secure_url 
    }

    //creating document with all required data
    const addUser = await User.create({ name, email, password: hashedPass, pic })

    const token = jwt.sign({ email, name, _id: addUser._id }, process.env.ACCESSTOKEN_SECRET_KEY)


    return res.status(200).json({ name, email, pic, token })
}


//============================================= login api ==========================================//
export const signIn = async (req, res, next) => {
    const { email, password } = req.body

    //checking email accuaracy and changing status too
    const isExist = await User.findOne({ email })
    if (!isExist) { return next(new Error('invalid credentials', { cause: 400 })) }

    //checking password accuaracy
    const checkPass = bcrypt.compareSync(password, isExist.password)
    if (!checkPass) { return next(new Error('invalid credentials', { cause: 400 })) }

    //creating token to send back in the response
    const { name, _id } = isExist
    const token = jwt.sign({ email, name, _id }, process.env.ACCESSTOKEN_SECRET_KEY)

    return res.status(200).json({
        name: isExist.name,
        email: isExist.email,
        pic: isExist.pic,
        _id: isExist._id,
        token
    })
}


//============================================ getAllUsers =============================================//
export const getAllUsers = async (req, res, next) => {
    const { ...search } = req.query

    const features = new ApiFeatures(req.query, User.find()).search(search)
    const users = await features.mongooseQuery
/*     const users = result.map((ele) => {
        return {
            name: ele.name,
            email: ele.email,
            pic: ele.pic,
            _id: ele._id
        }
    }) */
    return res.status(200).json(users)
}