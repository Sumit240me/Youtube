import { asyncHandler } from "../utils/asyncHandler.js";
// esha import tabhi lena hai jab export default na ho

import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// since the method to generate accessToken and Refresh token is so common that we are putting it in the seprate method
const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
      
        // ab ye token generate tho ho gaye hai lekin ye sirf is method ke andar hi hai tho refresh ko tho update karna padega
        // or access ko user ko return karna padega

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }) // ye validation magta hai save karne par tho humne usko false kar diya
        
        return { accessToken, refreshToken }
           
    } catch(error){
        throw new ApiError(500, "Something went wrong while generating the refresh and access token")
    }
}



// jab bhi koi web request ko handle karna ho tak asyncHandler ka use karna padhega
const registerUser = asyncHandler( async(req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for videos
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    // destructure kar lo
    const {fullName, email, username, password} = req.body
    console.log("email :", email);
    
    // if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    // }  //some is basically used to traverse each value   // map can also be used but we nwwd to chech for every return what it is giving

    if(
        [fullName,email, username, password].some((field) => 
            field?.trim() === "")
    ){
        throw new ApiError(400, "All field sre required")
    }
    // User se hi find karege ki user hai ki nahi   $or operator laga ke array ke andar jitne chahe utni value likh sakte hai
     const existedUser = await User.findOne({
         $or: [{username}, {email}]
     })

     if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
     }
    // req.body ke andar sara ka sara data ata hai jiska access hume express deta hai
    // baese hi multer hame req.file ka access de deta hai

    const avatarLocalPath = req.files?.avatar[0].path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    // checking wheater cover image is their or not
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length> 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    // chainning method se .select lagakar dekna padega ki kay kay nahi chaiye
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while checking the createdUser")
    }
    // ApiResponse se return kar sakte hai lekin agar app res.staus ke sath status code likhe tho bo achi practise hoti hai
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully" )
    )

} )

const  loginUser = asyncHandler(async(req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie 

    const {email, username, password} = req.body

    if(!username || !email){
        throw new ApiError(400, "username or email is required")
    }
    // The or operator find for anyOne of them either username or email if get then returns the value
    // database dusre continent mai hota hai tho await lagana padega
    const user = await User.findOne({
        $or: [{username},{email}]
     })

    // User ye mogodb ke mongoose ka User hai jo ki sirf ushike function jaise findone,get etc ke liye use hota hai
    // user -->> ye apke difined kiye gaye functions keyi liye use hota hai jaise "ispasswordCorrect"
    if(!user){
        throw new ApiError(404, "User does not access")
    } 
 
    const isPasswordValid = await user.ispasswordCOrrect(password);
    
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credential")
    } 

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    // agar expensive operation hai tho yahi update kar do
    // .select ==>> jo jo field nahi chaiye usko mana kar do
    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
     
    // httpOnly lagane se hum apni cookie ko dekh tho sakte hai lekin sirf server se hi unko update kar sakte hai
    const options = {
        httpOnly: true,
        secure: true
    }
    // jitni chaho utni cookie set kar skte ho
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    )

})

// humne middleware kyu banaya kyuki hume user ka data kahi se mil hi nahi raha tha Tho humne cookie|| header ke through Token nikale or phir usse user ko return karbaya

const logoutUser = asyncHandler(async(req,res) => {
 //kyuki humne middleware add kiya hai or middleware humko req.user ka access dila raha hai tho yaha par bhi hamare pass access hoga
 // refresh Token ko database se kar diya gayab
await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken: undefined
        }
    },
    {
        new: true
    }
    )

    // ab user ke yaha se Tokens ko remove aur karna hai
    
    const options = {
        httpOnly: true,
        secure: true
    }
    
    // clearCookie ka method hume cookie-parser provide karbata hai

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export { 
    registerUser,
    loginUser,
    logoutUser
 }