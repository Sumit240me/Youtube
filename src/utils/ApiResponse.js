class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export {ApiResponse}


// Here in both the ApiError ans ApiResponse cases we are making the class and their constructor so
//  that the uniformity of the code could be maintained