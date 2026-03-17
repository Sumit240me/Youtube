import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    if(!content){
        throw new ApiError(404, "Please provide all content to create the tweet")
    }

    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(404, "The user not found")
    }

    const createdTweet = await Tweet.create({
        content,
        owner: user._id
    })

    return res.status(200).json(
        new ApiResponse(200, createdTweet, "Tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const userTweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                owner: { $arrayElemAt: ["$owner", 0] } // Extract the first (and only) user document
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, userTweets, "User tweets fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const {tweetId} = req.params;
    const { content } = req.body;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(404, "please send the valid tweet")
    }

    const user =await User.findById(req.user?._id);

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "The tweet not found")
    }   

    if(tweet.owner.toString() !== user._id.toString()){
        throw new ApiError(403, "you are not allowed to update this tweet")
    }

    const updatedtweet = await Tweet.findByIdAndUpdate((tweetId),
     {
        $set:{
            content
        }
     },{ new :true}

)
// also wants return the updated tweet with the owner details populated    
   return res.status(200).json(
    new ApiResponse(200, updatedtweet, "tweet updated successfully")
   )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(404, "please send the valid tweet")
    }

    const user =await User.findById(req.user?._id);

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "The tweet not found")
    }   

    if(tweet.owner.toString() !== user._id.toString()){
        throw new ApiError(403, "you are not allowed to update this tweet")
    }

    const deletedtweet = await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(
        new ApiResponse(200, deletedtweet, "Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}