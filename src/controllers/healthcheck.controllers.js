//Healthcheck controller API thats used to check status of the server whether its running or not

import { ApiError } from "../utils/api-error.js"
import {ApiResponse} from "../utils/api-response.js"   //To use standard format of ApiResponse and ApiError
import { asyncHandler } from "../utils/async-handler.js"

/*
const healthcheck=async (req,res,next) => {
    try {
        //Before sending response of API, there is possibility that we might need to fetch user from DB. 
        //Whenever you need to access anything from DB, 2 things to remember (trycatch,async-await)

        const user=getUserFromDB()   
        res
        .status(200)            //Default statuscode if everything is working fine
        .json(                  //To send all response as JSON method
            new ApiResponse(200,{message: "Server is running in healthy state"})   //ApiResponse is a class. Creating an object of that class
        )                 //Passing data as JSON object
    } catch (error) {
        next(err)     //next is expressJS built-in error handler 
    }
}
    */

//Cleaner alternate method to handle ApiRequest without using trycatch
//Only difference: Instead of trycatch block, used async handler that promisifies and handles errors. Rest code is same
const healthcheck=asyncHandler(async (req,res)=> {  //Calling async handler function in same way
    res
    .status(200)
    .json(
        new ApiResponse(200, {message:"Server is running"})
    )})

export {healthcheck}