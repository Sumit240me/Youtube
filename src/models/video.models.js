import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
       videoFile: {
           type: String, // cloudinary url
           required: true
       },
       thumbnail: {
           type: String, // cloudinary url
           required: true
       },
       title: {
           type: String,
           required: true
       },
       description: {
           type: String,
           required: true
       },
       duration: {
        type: Number, // cloudinary url
        requird: true
       },
       views: {
        type:Number,
        default: 0
       },
       isPublished: {
        type: Boolean,
        default: true
       },
       owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
       }


    }, {timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)

// we can store these media file and images directly to database as mediaFile but it cause the huge load on database that's why we are using cloudinary