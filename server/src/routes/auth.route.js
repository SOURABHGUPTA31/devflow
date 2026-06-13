import express from "express"
import { getProfile, loginUser, registerUser } from  "../controllers/auth.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const authrouter=express.Router()

authrouter.post("/signup", registerUser)
authrouter.post("/login",loginUser)
authrouter.get("/profile",authMiddleware,getProfile)

export default authrouter

