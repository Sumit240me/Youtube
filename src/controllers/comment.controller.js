import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, {isValidObjectId} from "mongoose";
import { User } from "../models/user.models.js"

const getVideoComments = asyncHandler(async(req,res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

       // pagination
    page = parseInt(page);
    limit = parseInt(limit);  
   const skip = (page - 1) * limit;

    if(!isValidObjectId(videoId)){  
        throw new ApiError(404, "the videoId is not valid")
    }

    const comments = await Comment.findById(videoId)
    .sort({ createdAt: -1 }) 
    .skip(skip)
    .limit(limit)

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )

})

const addComment = asyncHandler(async(req,res) => {
   const {videoId} = req.params;
   const {content} = req.body;

   if(!(isValidObjectId(videoId))){
    throw new ApiError(404, "The VideoId is not valid")
   }

   if(content.trim() === ""){
    throw new ApiError(404, "Please provide the comment")
   }

   const comment = await Comment.create({
    content,
    video:videoId,
    owner:req.user?._id
   })

   return req.status(200).json(
    new ApiResponse(200, comment, "Comment created successfully")
   )
})

const updateComment = asyncHandler(async(req,res) => {
   const {commentId} = req.params;
   const { content } = req.body;

   if(!isValidObjectId(commentId)){
    throw new ApiError(404, "the commentId is not valid")
   }

   const user = await User.findById(req.user._id)
   if(!user){
    throw new ApiError(404, "cannot find the user")
   }

   const comment = await Comment.findById(commentId)
   if(!comment){
    throw new ApiError(404, "Cannot get the comment")
   }

   if(user._id.toString() !== comment.owner.toString()){
    throw new ApiError(403, "User is not allowed to make the changes")
   }

   comment.content = content
    await comment.save()

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    )

})

const deleteComment = asyncHandler(async(req,res) => {
   const {commentId} = req.params;

   if(!isValidObjectId(commentId)){
    throw new ApiError(404, "the commentId is not valid")
   }

   const user = await User.findById(req.user._id)
   if(!user){
    throw new ApiError(404, "cannot find the user")
   }

   const comment = await Comment.findById(commentId)
   if(!comment){
    throw new ApiError(404, "Cannot get the comment")
   }

   if(user._id.toString() !== comment.owner.toString()){
    throw new ApiError(403, "User is not allowed to make the changes")
   }
    // to delete the selected field
    await comment.deleteOne()
    
    return res.status(200).json(
        new ApiResponse(200, {}, "the selected comment got deleted")
    )
})


export {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
}