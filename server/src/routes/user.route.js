import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"

const userRouter = express.Router()

userRouter.post("/create",authMiddleware,authorization("admin"))