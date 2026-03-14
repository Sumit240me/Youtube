import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// kyuki cookie-parser ek middleware hai tho uska access req mai bhi hai sur response mai bhi hai
export const verifyJWT = asyncHandler(async(req,res, next) => {
    try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
        // TODO discuss about frontend
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()

    } catch(error){
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

// yaha hum token nikalne ki kosis kar rahe hai ya tho cookies se nikla lo ya phir header se

