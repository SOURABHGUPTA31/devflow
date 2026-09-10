
function authorization(...roles) {

   function authorize(req,res,next) {
    if(roles.includes(req.user.role)){
        next()
    }else{
        res.status(403).json({message: "You do not have permission to access this feature"})
    }
}

return authorize;
}

export default authorization