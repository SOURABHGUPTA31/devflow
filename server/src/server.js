import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./config/db.js";

dotenv.config()

let port = process.env.PORT || 5000

const startDB = async ( ) => {
    try{
       await connectDB()
       app.listen(port, () => {
      console.log(`server running on port ${port}`)
    })
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }
}

startDB()