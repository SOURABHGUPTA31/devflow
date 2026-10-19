import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"
import { createProject, getAllProjects, getprojectsById } from "../controllers/project.controller.js"

const projectRouter = express.Router()

projectRouter.post("/create-project",authMiddleware,authorization("admin"),createProject)
projectRouter.get("/getprojects",authMiddleware,authorization("admin"),getAllProjects)
projectRouter.get("/:projectId",authMiddleware,authorization("admin"),getprojectsById)


export default projectRouter