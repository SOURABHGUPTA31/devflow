import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import authorization from "../middlewares/authorization.middleware.js"
import { createProject } from "../controllers/project.controller.js"

const projectRouter = express.Router()

projectRouter.post("/create-project",authMiddleware,authorization("admin"),createProject)


export default projectRouter