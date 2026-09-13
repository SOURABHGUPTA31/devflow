import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"
import { createuser } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.post("/create",authMiddleware,authorization("admin"),createuser)

export default userRouter