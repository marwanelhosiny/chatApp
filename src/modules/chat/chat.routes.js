import { Router } from "express"
import expressAsyncHandler from "express-async-handler"

import * as cc from "./chat.controller.js"
import { validationFunction } from "../../middlewares/validation.middleware.js"
import { multermiddleware } from "../../middlewares/multerMiddleware.js"
import { auth } from "../../middlewares/auth.middleware.js"




const router = Router()


router.post('/',auth(),expressAsyncHandler(cc.accessChat))
router.get('/', auth(),expressAsyncHandler(cc.fetchAllChats))
router.post('/group', auth(), expressAsyncHandler(cc.createGroupChat))
router.patch('/group', auth(), expressAsyncHandler(cc.renameGroupChat))
router.patch('/groupAdd', auth(), expressAsyncHandler(cc.addToGroup))
router.patch('/groupKick', auth(), expressAsyncHandler(cc.removeFromGroup))














export default router