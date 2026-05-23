const errorhandle = (err,req,res,next) => {
    res.status(500).json({
        success:false,
        message:"internal server error"
    })
}

export default errorhandle