import mongoose from "mongoose"

const connectDB = async () => {
  try{
      await mongoose.connect(process.env.MONGODB_URL)
      console.log("DB connected")
  }
  catch(error){
      throw error
  }
}

export default connectDB