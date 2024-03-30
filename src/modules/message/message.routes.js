import { Router } from "express"
import expressAsyncHandler from "express-async-handler"

import * as mc from "./message.conroller.js"
import { auth } from "../../middlewares/auth.middleware.js"





const router = Router()


router.post('/',auth(),expressAsyncHandler(mc.sendMessage))
router.get('/:chatId', auth(), expressAsyncHandler(mc.fetchAllMessages))








export default router