// to take the .env variable as soon as possible for fast loading
// require('dotenv').config({path:'./env'}) but this breaks the consistency of becauese we are following the module syntax

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

// the other approach write function in db folder and import it here and execute

dotenv.config({
    path: './env'
})

// since connectDB is the async function always return the promise on execution

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is runnin at port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("Mongo db connection failed !!!", error);
})


// since this import dotenv syntax is not avaliable anywhere so we are using it as a experimental feature  we have made changes inside package.json
// inscript tag














// this is the first approach to connect the database but it creates our index file little bit messy
// import express from "express"
// const app = express()
// // ifee function imeditely executed
// ( async () => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        //to check if their is any error in express or not
//        app.on("error", (error) => {
//         console.log("ERROR: ", error);
//         throw error
//        })

//        app.listen(process.env.PORT, () => {
//            console.log(`App is listening on port ${process.env.PORT}`)
//        })

//     } catch (error){
//         console.error("ERROR: ",error)
//         throw err
//     }
// })()
