import express from "express"
import router from "./routes/health.routes.js";
import errorhandle from "./middlewares/error.middleware.js";
import authrouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import teamRouter from "./routes/team.route.js";

const app= express();

app.use(express.json());

app.use("/api",router)
app.use("/api/auth" , authrouter)
app.use("/api/user",userRouter)
app.use("/api/team",teamRouter)

app.use((req,res) => {
    res.status(404).json({
        success:false,
        message:"Route not found"
    })
})

app.use(errorhandle)

export default app;