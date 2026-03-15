import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// in the uploadField (it is a middleware) we are dealing with the upload options for uploading the images and videos
// upload provides us the various option like single , array, but we have selected the filed one which accepts the array as the input
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secure routes  ==>> Adding the middleware to check wheater the user is logedin or not
// multiple middleware can be added one after the another 
router.route("/logout").post(verifyJWT ,logoutUser)

router.route("/refersh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)
// patch mai bas selected details hi update hoti hai lekin Post mai sari details hi update ho jati hai
router.route("/update-accout").patch(verifyJWT, updateAccountDetails)

// here we are using two middleware in which first we need to verify wheater the user is loggedin or not then futher multer middlewRE for uploading the file
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// jab params se data lo tab thodi problem atti hai jaise ismai "/c/" add karna pada
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

export default router