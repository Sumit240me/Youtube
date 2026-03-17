import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async(req, res) => {
   const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

   // filter object
   let filter = {};

   if(userId){
    filter.owner = userId;
   }

   // regex is used for search in mongodb
   if(query){
    filter.$or = [
        {title: {$regex: query, $options: "i"}},
        {description: {$regex: query,$options:"i" }}
    ];
   }

   // Sorting

   let sort = {};

   if(sortBy){
     sort[sortBy] = sortType === "desc" ? -1 : 1;
   } else {
    sort.createdAt = -1;
   }

   // pagination
   const skip = (page - 1) * limit;

   // final query

   const videos = await Video.find(filter).sort(sort).skip(skip).limit(parseInt(limit));
   
    return res.status(200).json(
        new ApiResponse(200, videos, "get the required reasult")
    )
})

const publishAVideo = asyncHandler(async(req,res) =>{
    const { title, description } = req.body;

    if(
        [title, description].some((field) => 
              field.trim() === "")
    ){
        throw new ApiError(400, "Both title and description are required")
    }

    const user = await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(401, "User not found Can not upload the video")
    }
    
    const videoLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if(!(videoLocalPath && thumbnailLocalPath)){
        throw new ApiError(400,"Both video file and thumbnail required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!(video && thumbnail)){
        throw new ApiError(400,"Both video file and thumbnail required")
    }

    const storeVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration:video.url.duration || 2.00,
        owner:user._id
    })

    if(!storeVideo){
        throw new ApiError(500, "The video is not sored in database")
    }

     return res.status(201).json(
        new ApiResponse(200, storeVideo, "video uploaded successfully" )
    )
})

const getVideoById = asyncHandler(async(req,res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404,"The video you are seaching is not Found")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Got the searched video")
    )
})

const updateVideo = asyncHandler(async(req,res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404,"The video you are seaching is not Found")
    }

    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(500, "user not found");
    }

    if (!video.owner.equals(user._id)) {
    throw new ApiError(403, "You do not have permission to update this video");
}

    const thumbnailLocalPath = req.files?.thumbnail[0].path;   

    if(!(thumbnailLocalPath)){
        throw new ApiError(400,"thumbnail file required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnail.url){
        throw new ApiError(500, "Something wrong while uploading the thumbnail file")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
        $set:{
            thumbnail: thumbnail.url
        }
    },{ new: true}
    )

    if(!updatedVideo){
        throw new ApiError(500,"the video does not got update")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "the given details are updated")
    )
})

const deleteVideo = asyncHandler(async(req,res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404,"The video you are seaching is not Found")
    }

    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(500, "user not found");
    }

    if(video.owner !== user._id){
        throw new ApiError(403, "You donot have the permission to update the video")
    }

    const deleted = await Video.findIdAndDelte( videoId );

    if(!deleted){
        throw new ApiError("Something is wrong while deleting video")
    }

    return res.status(200).json(
        new ApiResponse(200, deleted, "Video deleted successfully")
    )

})

const togglePublishStatus = asyncHandler(async(req,res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}