//To create controller for Registering the user in Database (using 6-step process)

import {User} from "../models/users.models.js"  //To query anything from DB
import {ApiResponse} from "../utils/api-response.js"   //To use standard format of ApiResponse and ApiError
import {ApiError} from "../utils/api-error.js"   //To use standard format of ApiResponse and ApiError
import { asyncHandler } from "../utils/async-handler.js"
import {emailVerificationMailgenContent,
forgotPasswordMailgenContent,sendEmail}   from "../utils/mail.js"   //To verify user by email
import jwt from "jsonwebtoken"      //To decode and verify jwt
import crypto from "crypto"         //To create hashedToken from unHashedToken

//Function for generating access and Refresh Token altogether for given userId
const generateAccessAndRefreshToken=async(userId) => {  //Once user gets entered in DB, he gets userId
    try {
        const newUser=await User.findById(userId)           //With all DB operations, use await coz DB is always in another continent
        const accessToken=newUser.generateAccessToken();    //Using methods of schema to generate accessToken and refreshToken
        const refreshToken=newUser.generateRefreshToken();

        newUser.refreshToken=refreshToken;          //Saving only refresh token in DB
        await newUser.save({validateBeforeSave:false});     //We dont want all validations to run when are just adding one field               
        
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access token")
    }
}


//Function for registering new user in DB (6 step process)
const registerUser=asyncHandler(async (req,res)=>{

    //1. Take some data (Data is present in body of request)
    const {email,username,password,role}=req.body

    //2. Validate the data
    //We have created validator, middleware and implemented them in route to validate data

    //3. Check in DB for duplicates (TO run any query in DB, use DB model. To find any data, use find() or findOne())
    const existingUser=await User.findOne({
        $or: [{username},{email}]           //If either username is found or email is found (duplicacy)
    })

    if(existingUser){
        throw new ApiError(409, "User with email or username already exists",[])
    }

    //4. Save new user in Database (Attach UT,HT,tokenExpiry and save) (Create newUser, generate tokens then save new user in DB)
    const newUser=await User.create({
        email,
        password,               //Since mongoDB is noSQL DB, it can have flexible schema. Mongoose matches keys by name ot by position
        username,
        isEmailVerified:false
    })

    //To attach UT,HT and token expiry we use functionalities attached to schema
    //Functionalities attached to schema can be used by every entry of DB only (newUser here)

    const {unHashedToken,hashedToken,tokenExpiry}=newUser.generateTemporaryToken();

    //Saving emailVerificationToken (or hashed token) and emailVerificationExpiry in DB st it can be used later to verify email of user
    newUser.emailVerificationToken=hashedToken   //Will be used to verify email of user
    newUser.emailVerificationExpiry=tokenExpiry

    await newUser.save({validateBeforeSave:false});


    //5. Verify user by email (By calling function of sendEmail and passing options containing email, subject and mailgencontent)
    await sendEmail(
        {
            email:newUser?.email,  //If we have new user, we'll use its To email
            subject:"Please verify your email",
            mailgenContent:emailVerificationMailgenContent(newUser.username, 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
            )   //Dynamically generating verification url in email
        //We will create controller and route for verify-email and process this unhashed token
        }
    )

    //6. Send response back to user (Success msg)
    //Data of response
    const createdUser=await User.findById(newUser._id).select(
        "-password -emailVerificationExpiry -emailVerificationToken -forgotPasswordExpiry -forgotPasswordToken -refreshToken"
    )      //These are fields that wont be selected as you want them in your response

    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong while registering user")
    }
    
    return res      
    .status(200)
    .json(                  //Frontend expects response in structured format, thats why we use json object
        new ApiResponse(
            200,
            {user: createdUser},        //Send data as json object
            "User has been Registered Successfully in Project Management Platform app "
        )
    )
})


//Function to login user (7-Step process)
const loginUser=asyncHandler(async (req,res) => {
    //1. Take some data from frontend: From req.body
    const {email,password}=req.body

    if(!email){
        throw new ApiError(401,"Email is required")
    }

    //2. Validate data
    //We have created Validator file, middleware and implemented them in route to validate data

    //3. Check if user exists in DB: by User.findOne()
    const user=await User.findOne({email})

    if(!user){
        throw new ApiError(402,"User does not exist")
    }

    //4. Verify Password: By method attached to model isPasswordCorrect
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(403,"Incorrect Password")
    }

    //5. Generate access and refresh tokens
    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)
    
    
    //6. Send tokens as cookie
    //Cookies require options. Options are rules attached to cookie to make them secure
    const options={
        httpOnly:true,      //So that cookies are accessible by browser and server only (Since cookies are created by server and eaten by server)
        secure:true         //Cookies are sent over only https not http to prevent MIM attack
    }
    
    //7. Send response to user (with success msg)
    //Data of response
    const loggedInUser=await User.findById(user._id).select(
        "-password -emailVerificationExpiry -emailVerificationToken -forgotPasswordExpiry -forgotPasswordToken -refreshToken"
    )      //These are fields that wont be selected as you dont want them in your response
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken
            },
            "User Logged in Project management platform successfully"
        )
    )
})


//Function to Logout user 
//In order to logout user, set RT in DB as empty and clear AT&RT from cookie
const logoutUser=asyncHandler(async (req,res) => {
    const user=await User.findByIdAndUpdate(req.user?._id,{
            refreshToken:""         //Set RT as empty
        })
    const options={         //We'll need options to interact with cookies
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options) 
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse (
            200,
            {},
            "User logged out successfully"
        )
    )
})


//Function to get current user (Request already has user appended with it, return it)
const getCurrentUser=asyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,       //coz req.user is already an object
            "Current user fetched successfully"
        )
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
}