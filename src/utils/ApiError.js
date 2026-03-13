class ApiError extends Error {
    constructor(
        // required as input
        statusCode,
        message="Something went wrong",
        errors = [],
        stack = ""
    ){
        // overriden
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors


        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}


// useGPT ==>> a uniformerror syntax which helps in giving a understandable error

// jab bhi koii error aye tho hamari uhii kosis rahe gi ki ApiError se hi handle ho