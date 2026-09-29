import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const authMiddleware = async (req,res,next) => {
      const authHeader = req.headers.authorization

      if(!authHeader){
        return res.status(401).json({message:"Access denied"})
      }

      const token = authHeader.split(" ")[1]

      try {
        const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      )


      const user = await User.findById(decoded.userId)

      if(!user){
        return res.status(401).json({message:"user was not found"})
      }


      if(user.status === "disabled"){
        return res.status(403)
        .json({message:"Your account has been disabled. Please contact your organization administrator."})
      }


       
      req.user = decoded


      next()

      } catch (error) {
          return res.status(401).json({message:"Token is invalid or expired"})
      }

      
     
}

export default authMiddleware