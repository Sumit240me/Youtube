import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import { Video } from "../models/video.models.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist

    if(!(name && description)){
        throw new ApiError(500, "Both the name and description field are required")
    }

    const user = await User.findById(req.user?._id)

    const playlist = await Playlist.create({
            name,
            description,
            videos: [],
            owner: user._id
        })

     if(!playlist){
        throw new ApiError(500, "an error occured while creating the playList")
     }

     return res.status(200).json(
        new ApiResponse(200, playlist, "playList created")
     )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)){
        throw new ApiError(500, "the given userId is not valid");
    }

    const playList = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "playlists",
                localField: "_id",
                foreignField: "owner",
                as: "playlists"
            }
        },{
            $project: {
                playlists: 1,
                _id: 0
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, playList?.[0]?.playlists || [], "playLists fetched successfully")
    )
})


const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Please provide a valid playlist ID");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos", // Assumes the Video model's collection name is "videos" (Mongoose default)
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        }
    ]);

    if (!playlist || playlist.length === 0) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist[0], "Playlist retrieved successfully")
    );
});
    
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if( !isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(404, "Please provide the valid object")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "The playlist you are searching is not found")
    }

    const user = await User.findById(req.user?._id);

    if(playlist.owner.toString() !== user._id.toString()){
        throw new ApiError(403, "You are not authorized to add video to this playlist")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "The video you are searching is not found")
    }
 
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "The video is already in the playlist")
    }

    playlist.videos = [...playlist.videos, videoId]
    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
 if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
    throw new ApiError(404, "Please provide the valid playList or video to be removed")
 }

 const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "The playlist you are searching is not found")
    }

     const user = await User.findById(req.user?._id);

    if(playlist.owner.toString() !== user._id.toString()){
        throw new ApiError(403, "You are not authorized to add video to this playlist")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "The video you are searching is not found")
    }
 
    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400, "The playList does not contains the video")
    }
    
    playlist.videos =  playlist.videos.filter((videoId) => playlist.videos._id !== videoId)
    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, playlist, "video removed from the playList")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "The playList id is not valid")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "The playlist you are searching is not found")
    }

     const user = await User.findById(req.user?._id);

    if(playlist.owner.toString() !== user._id.toString()){
        throw new ApiError(403, "You are not authorized to add video to this playlist")
    }

    const deletedplaylist = await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(
        new ApiResponse(200, deletePlaylist, "The playList got deleted")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "The playList id is not valid")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "The playlist you are searching is not found")
    }

    const user = await User.findById(req.user?._id);

    if(playlist.owner.toString() !== user._id.toString()){
        throw new ApiError(403, "You are not authorized to add video to this playlist")
    }

    const updatedplaylist = await Playlist.findByIdAndUpdate((playlistId),
        {
            $set: {
            name,
            description
        }
    },{
        new : true
    }
    )
    return res.status(200).json(
        new ApiResponse(200, updatePlaylist, "The playList got updated")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}