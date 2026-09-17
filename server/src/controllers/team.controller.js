import Team from "../models/team.model.js"

export const  createTeam = async (req,res) => {
    const{name} = req.body

    if(!name){
        res.status(400).json({message:"Team name are required"})
    }

    const organization = req.user.organization

    const team = new Team ({
        name,
        organization
    })


     await team.save()

     return res.status(201).json({message:"Team created Succefully"})

    


}


export const getTeams = async (req,res) => {
    const organization = req.user.organization
    
    if(!organization){
      return  res.status(400).json({message:"organization was not found"})
    }

    const teams = await Team.find({ organization:organization})

    return res.status(200).json({teams})
    
}