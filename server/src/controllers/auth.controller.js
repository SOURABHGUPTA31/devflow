import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Organization from "../models/organization.model.js";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
  const { adminName, email, password, organizationName } = req.body;

  if (!adminName || !email || !password || !organizationName) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const existingOrganization = await Organization.findOne({
    name: organizationName,
  });

  if (existingOrganization) {
    return res.status(409).json({
      message: "Organization already exists",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const organization = new Organization({
      name: organizationName,
    });

    await organization.save({ session });

 
    const user = new User({
      name: adminName,
      email,
      password: hashedPassword,
      role: "admin",
      organization: organization._id,
    });

    await user.save({ session });

  
    organization.owner = user._id;

    await organization.save({ session });

  
    await session.commitTransaction();

    return res.status(201).json({
      message:
        "Organization and admin account created successfully. Please login to continue.",
    });
  } catch (error) {
   
    await session.abortTransaction();

    return res.status(500).json({
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};


     

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

