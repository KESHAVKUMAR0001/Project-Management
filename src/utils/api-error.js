//Defining standard format of API error by extending error class
class ApiError extends Error{
    constructor(            //These are 4 parameters that should be present whenever we thow any ApiError (status code must be present other 3 optional)
        statusCode,
        message="something went wrong",
        errors=[],     //Array of errors
        stack=""       //stack traces given to us by error
    ){
        super(message)     //Calling constructor of parent class error
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors
        
        if(stack)         //If stack trace is thrown by error take it otherwise generate auto stack trace and assign to constructor
            this.stack=stack
        else
            Error.captureStackTrace(this,this.constructor)
    }
}

export { ApiError }

//Now every API error will have this fixed number of parameters
/*
Using std API error:
    if(!user){
        throw new ApiError(404,"Invalid Reset Token")
    }
*/