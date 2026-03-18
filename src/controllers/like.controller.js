import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "please provide valid video id")
    }
    
    const previouslike = await Like.findOne({
        video: videoId,
        likedby: req.user._id
    });

    if(previouslike){
        await Like.deleteOne({_id:previouslike._id})
        return res.status(200).json(
            new ApiResponse(200, null, "Video unliked successfully")
        )
    }else{
        const like = await Like.create({
           video:videoId,
           likedby:req.user._id
        })

        return res.status(200).json(
            new ApiResponse(200, "Video liked successfully")
        )
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)){
        return new ApiError(400, "comment doest not found")
    }

    const previouslike = await Like.findOne({
        comment: commentId,
        likedby: req.user._id
    })

    if(previouslike){
        await Like.deleteOne({ _id: previouslike._id })
        return res.status(200).json(
            new ApiResponse(200, "comment unliked successfully")
        )
    }else{
        const like = await Like.create({
                comment:commentId,
                likedby: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(200, "commnet liked successfully")
        )
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!isValidObjectId){
        throw new ApiError(400, "cannot get the tweet")
    }

    const prevlike = await Like.findOne({
            tweet: tweetId,
            likedby: req.user._id
    })

    if(prevlike){
        await Like.deleteOne({ _id: prevlike._id })
        return res.status(200).json(
            new ApiResponse(200, "tweet unliked successfully")
        )
    }else{
        await Like.create({
            tweet:tweetId,
            likedby: req.user._id
        })
        return res.status(200).json(
            new ApiResponse(200, "tweet liked successfully")
        )
    }
}
)

// aggregate karke video ki bhi information dalni padegi

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

const likes = await Like.find({likedby: req.user._id})

if(!likes){
    throw new ApiError(400, "can not find the users like")
}

    const likedVideoId = likes.map((like) => like.video)

    return res.status(200).json(
        new ApiResponse(200, likedVideoId,"getLikedVideo successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}