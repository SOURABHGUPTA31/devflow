import USER_ROLES from "../constants/user.roles.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"

export const createuser = async (req,res) => {
      const {name,email,password,role} = req.body  

      if(!name || !email || !password  ){
        return   res.status(400).json({message: "All fields are required"})
      }

      const existinguser = await User.findOne({email});

      if(existinguser){
        return res.status(409).json({message:"Email already exists"})

      }

      const roles = [USER_ROLES.MEMBER,
        USER_ROLES.TEAMLEADER
      ]

      if(!roles.includes(role)){
        return res.status(400).json({message:"role are invalid"})
      }

      const hashedPassword = await bcrypt.hash(password,10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        organization: req.user.organization
      })

      await user.save()

      return res.status(201).json({message:"User sucsesfully created"})


}