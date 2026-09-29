import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"
import { assignTeamLeader, createuser, disabledUser, existingUser, getAllUsers } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.post("/create",authMiddleware,authorization("admin"),createuser)
userRouter.put("/:userId/team",authMiddleware,authorization("admin"), existingUser)
userRouter.put("/:userId/team-leader",authMiddleware,authorization("admin"),assignTeamLeader)
userRouter.get("/dashboard",authMiddleware,authorization("admin"),getAllUsers)
userRouter.put("/:userId/status",authMiddleware,authorization("admin"),disabledUser)

export default userRouter