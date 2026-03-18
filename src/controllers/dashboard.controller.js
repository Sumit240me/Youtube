import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    // means we have to find the user videos view, total subscribers he has, total videos he uploaded, total likes on videos

    const { channelId } = req.body;  

    const user = await User.findById(channelId);
    if(!user){
        throw new ApiError(404, "cannot find the channel")
    }
    
    const subscribers = user.subscribersCount;
    const subscribedTo = user.channelsSubscribedToCount;
    const isSubscribed = user.isSubscribed;
s
    const videos = await Video.find({ owner: channelId })
    const totalVideos = videos.length;

    //const totalViews = videos.reduce((acc, video) => acc + video.views, 0)

    await Video.aggregate([
        {
            $match: {
                owner:channelId
            }
        },
        {
           $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "totalLikes"
           }  
        },
        {
            addFields: {
                totalLikes: {
                    $size: "$totalLikes"
                }
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            user,
            subscribers,
            subscribedTo,
            isSubscribed,
            videos,
            totalVideos
        }, "Channel stats fetched successfully")
    )
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { channelId } = req.body;  // basically means the user who have created the channel so we have to find all the videos uploaded by this channel

    const videolist = await Video.find({ owner: channelId })

    if(!videolist){
        throw new ApiError(404, "cannot find the videos")
    }
    
    return res.status(200).json(
        new ApiResponse(200, videolist, "Videos fetched successfully")
    )

})

export {
    getChannelStats, 
    getChannelVideos
    }