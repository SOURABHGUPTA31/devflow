import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"
import { assignTeamLeader, createuser, disableUser, editMyProfile, enableUser, existingUser, getAllUsers } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.post("/create",authMiddleware,authorization("admin"),createuser)
userRouter.put("/:userId/team",authMiddleware,authorization("admin"), existingUser)
userRouter.put("/:userId/team-leader",authMiddleware,authorization("admin"),assignTeamLeader)
userRouter.get("/dashboard",authMiddleware,authorization("admin"),getAllUsers)
userRouter.put("/:userId/status/disable",authMiddleware,authorization("admin"),disableUser)
userRouter.put("/:userId/status/enable",authMiddleware,authorization("admin"),enableUser)
userRouter.put("/me",authMiddleware,editMyProfile)

export default userRouter