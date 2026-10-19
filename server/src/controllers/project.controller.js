import USER_ROLES from "../constants/user.roles.js"
import Project from "../models/project.model.js"
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

    if(startDate && Number.isNaN(Date.parse(startDate))){
        return res.status(400).json({message:"Start date must be valid date"});
    }
    
    if(deadline && Number.isNaN(Date.parse(deadline))){
        return res.status(400).json({message:"Deadline must be a valid date"})
    }

    if(startDate){
        const start = new Date(startDate);
        const today = new Date();

        start.setHours(0,0,0,0);
        today.setHours(0,0,0,0);

      if(start < today){
        return res.status(400).json({message:"start date cannot  be in the past"});
      }
    }

   

        if(deadline){
            const deadlineDate = new Date(deadline);
            const today = new Date();

            deadlineDate.setHours(0,0,0,0);
             today.setHours(0,0,0,0);

             if(deadlineDate < today){
                return res.status(400).json({message:"Deadlilne cannot be in the past"});
             }
        }

        if (startDate && deadline && new Date(deadline) < new Date(startDate)) {
           return res.status(400).json({
              message: "Deadline cannot be before the start date"
         });
      }

     const project = await Project.create({
        name:name.trim(),
        description,
        organization:req.user.organization,
        team:teamId,
        createdBy:req.user.userId,
        members,
        client,
        startDate: startDate || undefined,
        deadline: deadline || undefined
     }) 


     return res.status(201).json({
        message:"Project created successfully",
        project
     })
   
}


export const getAllProjects = async (req,res) => {
    const projects = await Project.find({
        organization:req.user.organization,
        isArchived:false
    })
    .populate("team","name")
    .populate("createdBy","name")
    .populate("members","name")

    return res.status(200).json({message:"Projects fetched successfully",
        projects
    });
}

export const getprojectsById = async (req,res) => {
    const {projectId} = req.params

    const projectInfo = await Project.findOne({
        _id : projectId,
        organization:req.user.organization
    })
      .populate("createdBy","name")
       .populate("members","name")
        .populate("team","name")


    if(!projectInfo){
        return res.status(404).json({message:"project not found"})
    }

    projectInfo.populate("createdBy","name")
    projectInfo.populate("members","name")
    projectInfo.populate("team","name")

    return res.status(200).json({message:'project featched successfully',
        projectInfo
    })
}

export const updateProjects = async (req,res) => {
    
}