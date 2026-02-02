//Create middleware to validate the data

import {validationResult} from "express-validator"  //Validation results will be given by express-validator
import {ApiError} from "../utils/api-error.js"      //To throw error in standard format

export const validate=(req,res,next)=>{
    //Before this middleware, all validators have runand attached their errors to req 
    const errors=validationResult(req)          //Storing all errors of request
    //If we dont have any error, we dont have to do anything, move to next middleware
    //But if we do have error, Extract errors into an array and pass so that it can be read

    if(errors.isEmpty())
        return next()

    const extractedErrors=[]
    errors.array().map((err)=> extractedErrors.push
    ({
        [err.path]:err.msg
    })) //Pushing errors along with their path and msg

    throw new ApiError(422, "Received data is not valid",
        extractedErrors)
}

//Validation result given by express-validator. If its empty, next. If not empty, extract errors and throw
//This middleware can be used for both userRegistrationValidator and userLoginValidator files