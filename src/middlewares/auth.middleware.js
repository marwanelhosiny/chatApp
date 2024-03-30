import jwt from "jsonwebtoken"
import User from "../../DB/models/user.model.js"

//==================================================authentication middlleware========================================//
export const auth = () => {
    return async (req, res, next) => {
        try {
            const { accesstoken } = req.headers
            if (!accesstoken) { return next(new Error('missing access token', { cause: 400 })) }
            const prefix = accesstoken.startsWith(process.env.ACCESSTOKEN_PREFIX)
            if (!prefix) { return next(new Error('invalid token', { cause: 400 })) }

            const token = accesstoken.slice(6)
            const verifiedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET_KEY)
            if (!verifiedToken || !verifiedToken._id) { return next(new Error('invalid token payload', { cause: 400 })) }

            //checking if user is deleted or role updated while using an old valid token
            const stillExist = await User.findById(verifiedToken._id, 'name email _id')
            if (!stillExist) { return next(new Error('please signUp first', { cause: 400 })) }
            req.authUser = stillExist
            next()
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
}