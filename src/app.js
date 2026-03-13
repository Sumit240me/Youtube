import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Now we are configuring our data that type of data we are accepting using middleware
// setting the limit of data accepted in json formate
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
// this middleware is used to take values from the url 

app.use(express.static("public"))
// koi bhi images aii, pdf aii tho usko apne server par store kar ke rakh sakte hai
app.use(cookieParser())  // user ke cookie ko read kar apyee

export { app }