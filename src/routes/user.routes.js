import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";
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



export default router