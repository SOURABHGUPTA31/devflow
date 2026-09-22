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


  export const assignTeamLeader = async (req,res) => {
    const {userId} = req.params
    const {teamId,confirmChange} = req.body

    const user = await User.findOne({
        _id: userId,
        organization:req.user.organization

    })

    if(!user){
        return res.status(400).json({message:"user was not found"})
    }


     const team = await Team.findOne({
        _id:teamId,
        organization:req.user.organization
     })

     if( !team){
        return res.status(400).json({message:"team  not found"})
     }

     if(team.teamLeader.equal(user._id)){
        return res.status(400).json({message:"user has allready a teamleadre of this team"})
     }

     if(team.teamLeader && !confirmChange){
        return res.status(403).json({message:"Team already has a Team Leader", 
            requiresConfirmation:true})
     }


      if(user.role =="member"){
         if(team._id.equals(user.team)){
              team.teamLeader = user._id;
              user.role = USER_ROLES.TEAMLEADER;
         }  else{
            team.teamLeader = user._id;
            user.team = team._id;
            user.role = USER_ROLES.TEAMLEADER
         }   
    }else{
        return res.status(400).json({message:"role is invalid"})
    }

    await user.save();
    await team.save();

    return res.status(200).json({message:"New Team Leader assigned successfully"})


  }