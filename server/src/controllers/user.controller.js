import USER_ROLES from "../constants/user.roles.js"
import Team from "../models/team.model.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"

export const createuser = async (req, res) => {

    const { name, email, password, role, teamId } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(409).json({
            message: "Email already exists"
        })
    }

    const roles = [
        USER_ROLES.MEMBER,
        USER_ROLES.TEAMLEADER
    ]

    if (!roles.includes(role)) {
        return res.status(400).json({
            message: "Invalid role"
        })
    }

    let team

    if (teamId) {

        const findTeam = await Team.findOne({
            _id: teamId,
            organization: req.user.organization
        })

        if (!findTeam) {
            return res.status(400).json({
                message: "Team was not found"
            })
        }

        team = teamId
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        organization: req.user.organization,
        team: team
    })

    await user.save()

    console.log("CREATED USER:", user)

    return res.status(201).json({
        message: "User successfully created"
    })
}

export const existingUser = async (req,res) =>{

  const {userId} = req.params
  const { teamId } = req.body
    
   const user = await User.findOne({
     _id:userId,
      organization:req.user.organization

   })

  if(!user){
    return res.status(400).json({message:"user  not found"})
  }

  const team = await Team.findOne({
    _id:teamId,
    organization:req.user.organization
  })

  if(!team){
    return res.status(400).json({message:"team not found"})
  }


   user.team = teamId

   await user.save()

   return res.status(200).json({message:"Team assigned succesfuly"})
  
  }


  export const assignTeamLeader = async (req,res,next) => {
    const {userId} = req.params
    const {teamId} = req.body

    const user = await User.findOne({
        _id: userId,
        organization:req.user.organization

    })

    if(!user){
        return res.status(400).json({message:"user was not found"})
    }

    if(user.role =="member"){
    
    }else{
        return res.status(400).json({message:"role is invalid"})
    }

     const team = await Team.findOne({
        _id:teamId,
        organization:req.user.organization
     })

     if( !team){
        return res.status(400).json({message:"team  not found"})
     }

     if(user.role == teamLeader){
        return res.status(403).json({message:"team leader already assign in different team "})
     }
  }