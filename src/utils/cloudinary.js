// yaha par file server par aa chuki hai

import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
// fs file system hai node ke andar pahele se hi hota hai ye kay help karta hai apko read, write ,remove,add
// link or unlink karna padta hai file ko delete karne ke liye


// ye cofiguration hi usko file upload karne ki permission degi
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary    2nd option is for selecting the type of file we are uploading
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);
        return response;

    } catch(error){
       fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got failed
       return null;  // unlinks the file in synchronous way
    }
}

export {uploadOnCloudinary}



// cloudinary.uploader
//   .upload("my_image.jpg")
//   .then(result=>console.log(result));

// ek method banao usme path us path se upload kar do or gar successful ho gaya tho unlink kardo  