import USER_ROLES from "../constants/user.roles.js"
import Team from "../models/team.model.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import mongoose from "mongoose"

export const createuser = async (req, res) => {

let session
let findTeam

try{
    const { name, email, password, role, teamId , confirmChange} = req.body

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

    if(role === USER_ROLES.TEAMLEADER && !teamId){
       return res.status(400).json({
          message: "Team is required for Team Leader"
     })
   }

  
    let team

    if (teamId) {

        findTeam = await Team.findOne({
            _id: teamId,
            organization: req.user.organization
        })

        if (!findTeam) {
            return res.status(400).json({
                message: "Team was not found"
            })
        }

        if (role === USER_ROLES.TEAMLEADER && findTeam.teamLeader && !confirmChange) {
    return res.status(403).json({
        message: "Team already has a Team Leader",
        requiresConfirmation: true
    })
}


        team = teamId
    }


     session = await mongoose.startSession()
      session.startTransaction()

   if (
            role === USER_ROLES.TEAMLEADER &&
            findTeam &&
            findTeam.teamLeader &&
            confirmChange
        ) {

            const oldTeamLeader = await User.findById(
                findTeam.teamLeader
            ).session(session)

            if (oldTeamLeader) {
                oldTeamLeader.role = USER_ROLES.MEMBER
                await oldTeamLeader.save({ session })
            }
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

    await user.save({session})

    if(user.role == USER_ROLES.TEAMLEADER){
        const team = await Team.findOne(
           { _id: teamId,
            organization:req.user.organization
           }
        ).session(session)

        if(!team){
            return res.status(400).json({message:"team was not found"})
        }else{
            team.teamLeader = user._id
        }



       await team.save({session})
    }

    await session.commitTransaction()

    return res.status(201).json({
        message: "User successfully created"
    })
}
  catch (error) {

        await session.abortTransaction()

        return res.status(500).json({
            message: "Internal server error"
        })

    } finally {

        await session.endSession()

    }
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
     
     if(team.teamLeader){

        if(team.teamLeader.equals(user._id)){
            return res.status(400).json({message:"User is already the teamleader of this team"})
        }

        if(!confirmChange){
            return res.status(403).json({message:"team already has a teamleader",
                requiresConfirmation:true
            })
        }

        const oldTeamLeader = await User.findById(team.teamLeader)

        if(oldTeamLeader){
            oldTeamLeader.role = USER_ROLES.MEMBER
            await oldTeamLeader.save()
        }
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