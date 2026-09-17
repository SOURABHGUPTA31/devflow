import express from "express"
import { createTeam, getTeams } from "../controllers/team.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"

const teamRouter = express.Router()

teamRouter.post("/create",authMiddleware,authorization("admin"),createTeam)
teamRouter.get("/",authMiddleware,authorization("admin"),getTeams)

export default teamRouter