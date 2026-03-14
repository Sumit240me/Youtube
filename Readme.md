# This is the youtube app 

# This will help to understand the core concept of backend

# nodemon reload the servere automatically whenever changes are made in it  changes are made inside thescript tag after installing nodemon

# dev-dependency -->> are the dependency which are used in development no need of taking them to production  

# step 1 make the basic structure inside the src folder like controllers, db, middleware, models, routes, utils--> utilites

<!-- npm i prettier --> 
<!-- this will help in definning the coommon syntax among different users who all are working on the same project -->
# create .prettierignore which will help inignoreing the file from prettier

# step 2 Data-base connection
# install .env mongoose express

# database ko hamesa try catch mai warp kro kyuki problems aa akti hai

# important line "database hamesa dusare continent mai hai" tho async await kai use karo

# step 3  working in app.js on express 

# step 4 jab bhi hum middleware ka use karte hai tho hum "app.use" karte hai

# npm i cookie-parser cors 
# cors means cross origin resourse sharing it accepts the request from only give frontend url

# middlewares are used in between function for checking the auhentication of the users (err,req,res,next)

# step 5 kisi bhi function ko hum async and try catch ka wrapper provide karba rahe hai utils mai uska asyncHandler ka code hai

# step 6 Handling the error and respone so it also look much structural formate 5:32 se hai thoda difficult hai

# step 7 we are starting with the modelling of the data in the models folders

# THE MOST IMPORTANT USE OF MONGODB IS AGGREGATING DATA "mongoose-aggregate-paginate-v2"  study with Aggregate-pipeline

# npm i bycrpt it helps in hashing the password

# npm i jasonwebtoken helps in creating the tokens the Secret helps in protecting our password

# used bcrypt inside user
# now using jwt definning the secret

# step 8 we are learing here the file upload most of time we uses third party app

# Here we are suing cloudinary services for uploading our file
# multer is also used on express study about it github multer

# multer ke through hi file upload hoti hai cloudinary "sdk" tho ek service hai jaise aws ek service hai

# hum kay kar rahe hai multer ke through apni file ko server se le kar local storage me daal dege aur phir local storage se usko cloudinary par upload kar dege  direct bhi kar sakte hai lekin 2 step process is the best

# code for cloudinary is written inside the utils ==>> utils is bascially used for writting the mehtods or function that are used at multiple places with different input type

# Now we are writting the middleware using multer inside middleware

# step  Now we are moving towards writting the controllers which is very important for logic building  The First step we are going to write the register logic

# the next step is creating the route in routes folder

# importing both the userRoutes ans userController in app.js

# Now we are moving towards the logic of writing the registerUser code 

# Now study the following console.log(cloudinary response , req.body, req.files, )

# PART 2

# Jab tak appke pass Acces token hai tho app koi bhi authentication service ko access kar sakte ho jaise data upload karna (ye short term ke liye hota hai)

# Refresh token (Long lived hota hai) jab apka access token expire ho jaee tho hum refresh token ko match karthe hai jo ki harame database mai aur user ke pass hota hai agar same hota hai tho user ko dusra access token provide kar diya jata hai.

# we starting with writting the login code for user

# in logedinUser we are learning how to send cookies

# now we are moving towards the new functionality which is subcription