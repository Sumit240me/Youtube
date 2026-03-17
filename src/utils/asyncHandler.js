// ye ek higher order function hai jo ki function ko input lekar usko promise mai wrap karke return mai function ko de deta hai

const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
    }
}

export {asyncHandler}





// Both the functions are same the above one uses promise syntax which is most modern one
// and the down one uses try and catch syntax

//higher order function -->> Bo function jo function ko accept bhi treat karte hai ya return bhi karte hai

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async() => {}


// const asyncHandler = (fn) => async() => {
//     try {

//         await fn(req, res, next)

//     } catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

