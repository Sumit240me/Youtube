import multer from "multer";


// ye jo function mai file ka option hai ye multer ke through hi ata hai hai or isko hi lane ke liye multer ka use hota hai

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")  // 2 option is for where we wants to keep our file on server/backend
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({
     storage,
     })


