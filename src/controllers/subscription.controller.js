import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "please provide valid channel")
    }
    // we are trying to remove user from channel --> subscriber or we are trying to add it
    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(400, "channel does not exist")
    }

    const user = await User.findById(req.user._id)
    if(!user){
        throw new ApiError(404, "user does not exit")
    }
    
    const subscription = await Subscription.findOne({
        subscriber: user._id,
        channel: channelId
    })  
    // if aready subscribed then remove the subscription
    if(subscription){
        await subscription.remove()
        return res.status(200).json(
            new ApiResponse(200, null, "Unsubscribed successfully")
        )
    }else{
        // if not then create new Subscription document
        const newSubscription = await Subscription.create({
            subscriber: user._id,
            channel: channelId
        })  
    
    return res.status(200).json(
        new ApiResponse(200, null, "Subscribed successfully")
    )
}
   
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "please provide valid channel")
    }
   
    const user = await User.findById(channelId);

    if(!user){
        throw new ApiError(400, "cannot find the user")
    }
    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel:channelId
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        {
            $project: {
            subscriberDetails: {
                _id: 1,
                username: 1,    
                email: 1,
                fullName: 1
            }
        }
    }
    ])

    return res.status(200).json(
        new ApiResponse(200,subscribers, "Subscribers fetched successfully")
    )
   
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(404, "The subscriberId is not valid")
    }

     const subscribedChannels = await Subscription.aggregate([
        {
            $match : {
                subscriber: subscriberId
            }
        },
        {
            $lookup: {
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedTo"
            }
        },
        {
            $project: {
                subscribedTo: {
                    _id: 1, 
                    username: 1,
                    email: 1,
                    fullName: 1
                }
        }
    }
    ])

    return res.status(200).json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully")
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}