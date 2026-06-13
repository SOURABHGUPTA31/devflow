import User from "../models/user.model.js"
import  bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUser = async (req,res) => {
      const {name,email,password} = req.body
    
      if(!name || !email || !password){
         return res.status(400).json({message:"all feild are required"})
      }
     
          const existingUser = await User.findOne({email})
          
          if(existingUser){
            return res.status(400).json({message:"email already reagister"})
          }

           const hashedPassword = await bcrypt.hash(password,10)

           const user =await User.create({
            name,
            email,
            password:hashedPassword
           })

           return res.status(201).json({message:"User created succesfully"})
      }


export const loginUser = async (req,res) => {
  const {email,password} = req.body

  if(!email || !password){
    return res.status(400).json({message:"All fields are required"})
  }

  const existingUser = await User.findOne({email})

  if(!existingUser){
      return res.status(400).json({message:"Invalid credentials"})
  }

  const isMatch = await bcrypt.compare(password,existingUser.password)

  if(isMatch == false){
    return res.status(400).json({message:"invalid credintals"})
  }

  const token = jwt.sign(
    {userId: existingUser._id},
    process.env.JWT_SECRET,
    {expiresIn:"7d"}
  )

  return res.status(200).json({message:"user loggedIn successfully",
    token
  })
}

export const getProfile = async (req,res) => {
    const userId = req.user.userId
    
    const user = await User.findById(userId).select("-password")

    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    
    return res.status(200).json({user})

}


 export const getPro = async (req,res) => {

    }
