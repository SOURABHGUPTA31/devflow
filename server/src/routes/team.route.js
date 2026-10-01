import express from "express"
import { createTeam, deleteTeam, editTeam, getTeams, teamDetails } from "../controllers/team.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"

const teamRouter = express.Router()

teamRouter.post("/create",authMiddleware,authorization("admin"),createTeam)
teamRouter.get("/",authMiddleware,authorization("admin"),getTeams)
teamRouter.get("/:teamId/details",authMiddleware,authorization("admin"),teamDetails)
teamRouter.put("/:teamId/edit",authMiddleware,authorization("admin"),editTeam)
teamRouter.delete("/:teamId",authMiddleware,authorization("admin"),deleteTeam)


export default teamRouter