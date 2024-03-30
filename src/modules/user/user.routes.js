import { Router } from "express"
import expressAsyncHandler from "express-async-handler"

import * as uc from "./user.controller.js"
import { auth } from "../../middlewares/auth.middleware.js"
import { validationFunction } from "../../middlewares/validation.middleware.js"
import { multermiddleware } from "../../middlewares/multerMiddleware.js"
import { signupSchema, signinSchema } from "./user.schemas.js"




const router = Router()









router.post('/', multermiddleware().single('profilePic') ,validationFunction(signupSchema), expressAsyncHandler(uc.signUp))
router.post('/login', validationFunction(signinSchema), expressAsyncHandler(uc.signIn))
router.get('/',auth(),expressAsyncHandler(uc.getAllUsers))


export default router