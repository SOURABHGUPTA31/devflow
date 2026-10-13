import mongoose, { Schema }  from "mongoose"

const clientSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
 email:{
  type:String,
  required:true
 },
 phone:{
  type:String
 }
})


const ProjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
      type:String
    },
    organization:{
      type:Schema.Types.ObjectId,
      ref:"Organization",
      required:true
    },
    team :{
    type:Schema.Types.ObjectId,
    ref:"Team",
    required:true
    },
    createdBy:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    members:[{
      type:Schema.Types.ObjectId,
      ref:'User'
    }],

      client:clientSchema,

    status:{
      type:String,
      enum:["planned","active","onHold","completed","cancelled"],
      default:"planned"
    },
    startDate:{
      type:Date
    },
    deadline:{
       type:Date
    },
    isArchived:{
         type:Boolean,
         default:false
    }
    
},{timestamps:true})

const Project = mongoose.model("Project",ProjectSchema)

export default Project