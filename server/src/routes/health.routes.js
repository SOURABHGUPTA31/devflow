import express from "express"

const router = express.Router()

router.get("/health",(req,res) => {
    res.json({
        message:"devflow work properly"
    })
})

router.post("/test",(req,res) => {
    req.body
    res.status(200).json(req.body)
})

router.get("/user/:id",(req,res) => {
    res.json({
        userId:req.params.id
    })
})

router.get("/search",(req,res) => {
    res.json({
        searched:req.query
    })
})

router.get("/delay",(req,res) => {
    setTimeout(() => {
        res.json({
            message:"message is delay"
        })
    }, 3000);
})

export default router




