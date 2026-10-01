import USER_ROLES from "../constants/user.roles.js"
import Team from "../models/team.model.js"
import User from "../models/user.model.js"
import { existingUser } from "./user.controller.js"

export const  createTeam = async (req,res) => {
    const{name} = req.body

    if(!name){
      return  res.status(400).json({message:"Team name is required"})
    }

    const organization = req.user.organization
    
    const existingTeam = await Team.findOne({
        name,
        organization
    })

    if(existingUser){
        return res.status(409).json({message:"Team alreday exists"})
    }

    const team = new Team ({
        name,
        organization
    })


     await team.save()

     return res.status(201).json({message:"Team created Succefully"})

    


}

export const getTeams = async (req,res) => {

   const teams = await Team.find({organization:req.user.organization})

   .select("name teamLeader")
   .populate("teamLeader", "name role email")
   
   if(teams.length === 0){
    return res.status(404).json({message:'No Team Available.please create a Team'})
   }
   
   
   return res.status(200).json({teams})
    
}


  export const teamDetails = async (req,res) => {
    const {teamId} = req.params

    const team = await Team.findOne({
        _id:teamId,
        organization:req.user.organization
    }).populate("teamleader","name email role")

    if(!team){
        return res.status(400).json({message:"team were not found"})
    }
 

    const member =  await User.find({
        team:teamId,
        role:USER_ROLES.MEMBER,
        organization:req.user.organization
    })

    return res.status(200).json(
       { team,
        member})
    
  }


  export const editTeam = async (req,res) => {
     const {teamId} = req.params
     const{name} = req.body

     const team = await Team.findOne({_id:teamId,
        organization:req.user.organization
     })

     if(!team){
        return res.status(404).json({message:"teamwas not found"})
     }

     const updateName = name.trim()

     if(updateName === team.name){
        return res.status(400).json({message:"no cahnge were made"})
     }

     if(!updateName){
        return res.status(400).json({message:"team name can not be blank "})
     }

     const existingTeam = await Team.findOne({
        name:updateName,
        organization:req.user.organization,
        _id:{$ne:teamId}
     })

     if(existingTeam){
        return res.status(409).json({message:"team name already exists"})
     }

    team.name = updateName

      await  team.save()

      return res.status(200).json({message:"team name successfully updated"})

  }


  export const deleteTeam = async (req,res) = {
      const {teamId} = req.params

      const tea
    }
