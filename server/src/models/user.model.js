import mongoose, { Schema } from "mongoose"

const userSchema  = new mongoose.Schema({
    name:{
       type:String,
       required:true
    },
    email:{
      type:String,
      required:true,
      unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","teamlead","member"],
        default:"member"
    },
    organization:{
        type:Schema.Types.ObjectId,
        ref:"Organization",
        required:true,
        unique:true
    }

},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User


