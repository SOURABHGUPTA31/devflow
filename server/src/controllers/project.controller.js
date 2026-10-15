import USER_ROLES from "../constants/user.roles.js"
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

    if (!Array.isArray(members)) {
    return res.status(400).json({
        message: "Members must be an array"
    });
}

   if(new Set(members).size !== members.length){
        return res.status(400).json({
            message:"Dublicate members are not allowed"
        })
    }

    const users = await User.find({
        _id : {$in : members},
        organization:req.user.organization,
        team:teamId,
        status: "active",
        role : USER_ROLES.MEMBER
    })

   

    if(users.length !== members.length){

        const validUserIds = users.map((user) => String(user._id));

        const invalidUserIds = members.filter((id) => {
            return !validUserIds.includes(String(id));
        })

        return res.status(400).json({
            message:"One or more selected members are invalid or unavailable"
        })
    }

    if(!client || typeof client !== "object" || Array.isArray(client)){
        return res.status(400).json({message:"client infornmation is required"})
    }

    if(typeof client.name !== "string" || !client.name.trim() || typeof client.email !== "string" || !client.email.trim()){
        return res.status(400).json({message:"Client name and email are required"})
    }

    if(client.phone !== undefined && (typeof client.phone !== "string"  || !client.phone.trim())){
        return res.status(400).json({message:"Phone must be a non-empty string when provided"})
    }

    

   
}