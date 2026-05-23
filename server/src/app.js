import express from "express"
import router from "./routes/health.routes.js";
import errorhandle from "./middlewares/error.middleware.js";

const app= express();

app.use(express.json());

app.use("/api",router)

app.use((req,res) => {
    res.status(404).json({
        success:false,
        message:"Route not found"
    })
})

app.use(errorhandle)

export default app;