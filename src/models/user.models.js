import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
       username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
       }, 
       email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
       }, 
       fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
       }, 
        avatar: {
            type: String, // cloudinary url jo ki images, videos, ko store karke unka url dedata hai
            required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }  

    },{timestamps:true})

userSchema.pre("save", async function () {

    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);

})
// checking wheater the user has gien the correct password as stored in the database or not
// definning own method

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)   // true ya false return karta hai
}

// Both are the jwt token only the difference is the usage
// here we are creating the tokens using jwt.sign(_,_,_)   // jwt.sign requires three type of input (1) the values from which your are trying to create token (2)The secret values which are required for creating the token (3)the expirary time
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username: this.username, // 2nd value database se aa rahi hai
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
         },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)

// ye jo user hai bo database se direct contact kar sakta hai kyu -- kyuki ye mongoose se bana hai isliye isko export bhi kiya hai
// export karke isse rigister user karte samee check karege ki user already exist or not


// kisi bhi feild par seaching enable karni hoti hai tho hum index true kar dete hai

// Pre Hook jaise hi app data ko save karne ja rahe ho just usse pahle use mai changes kar sakta hai
// ye Schema ke andher hi avaliable hote hai plugin ke jaise

// arrow function nahi chalta  -->> ye process thodi time consuming hai tho async ka use karna padta hai

// bcrypt.hash password ko hash kardetha hai lekin abhi bo har bar kar dega lekin hum chaite hai ki jab usmai changes ho tabhi bo bcrypt kare


// jwt ek barrier token hai --->> ek chabi ki tarah hai jo bhi sahi chabi dega usko data de deta hai