import Team from "../models/team.model.js"
import User from "../models/user.model.js"

export const createProject = async (req,res) => {
    const {name,description,teamId,members,client,startDate,deadline} = req.body

    if(typeof name !== "string" || !name.trim() || !teamId){
        return res.status(400).json({message:"project name and team were required"})
    }
    
    const team = await Team.findOne({
        _id:teamId,
        organization:req.user.organization
    })

    if(!team){
        return res.status(404).json({message:"team was not found"})
    }

    const users = await User.findOne({
        
    })


   
}