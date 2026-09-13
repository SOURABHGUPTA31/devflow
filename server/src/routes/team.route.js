import express from "express"
import { createTeam } from "../controllers/team.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"

const teamRouter = express.Router()

teamRouter.post("/create",authMiddleware,authorization("admin"),createTeam)

export default teamRouter