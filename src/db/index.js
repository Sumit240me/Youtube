import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// DB in another continent
// database connect hoga tho problem aa sakti hai tho try catch mai rakho

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch(error){
        console.log("Mongodb connection failed", error);
        // get exist from current ongoing process
        process.exit(1)
    }
}

export default connectDB;