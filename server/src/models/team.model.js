import mongoose, { Schema } from "mongoose";

const teamSchema = new mongoose.Schema({
   name:{
      type:String,
      required:true
   },
   organization:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true
   },
   teamLeader: {
       type:Schema.Types.ObjectId,
       ref:"User",
      required:false
   }
},{timestamps:true})

const Team = mongoose.model("Team",teamSchema)

export default Team