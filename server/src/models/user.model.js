import mongoose, { Schema } from "mongoose"
import USER_ROLES from "../constants/user.roles.js"

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
        enum:[USER_ROLES.ADMIN,
            USER_ROLES.TEAMLEADER,
            USER_ROLES.MEMBER
        ],
        default:"member"
    },
    organization:{
        type:Schema.Types.ObjectId,
        ref:"Organization",
        required:true,
    },
    team:{
      type:Schema.Types.ObjectId,
      ref:"Team",
      required:false,
    }

},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User


