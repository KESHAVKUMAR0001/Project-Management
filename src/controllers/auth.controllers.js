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


//Function to verify email
const verifyEmail=asyncHandler(async (req,res)=>{

    //1. Take the verification token from URL (in req.params that contains url parameters)
    const verificationToken=req.params.verificationToken      
    //Verification Token must be present in URL or route as parameter

    if(!verificationToken){
        throw new ApiError(
            400,
            "Email verification token is missing"
        )
    }

    //2. Convert that unhashed token to hashed token and match it with emailVerificationToken stored in DB with greater emailVerificationExpiry
    //While registering user, we sent a dynamic link containing unhashed token 
    //and stored emailVerificationToken (or hashed token) and emailVerificationExpiry in DB)
    let hashedToken=crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex")

    const user=await User.findOne({
        emailVerificationToken:hashedToken,
        emailVerificationExpiry:{$gt:Date.now()}    //emailVErificationToken must have greater emailVerificationExpiry
    })

    if(!user){
        throw new ApiError(401,"User verification has been failed")
    }

    //3. If token is matched and not expired, mark isEmailVerified flag as true,clear token and save user
    user.emailVerificationToken=undefined
    user.emailVerificationExpiry=undefined      //st data is not stored in DB unnecessary
    
    user.isEmailVerified=true
    await user.save({validateBeforeSave:false})

    //4. Send response 
    return res
    .status(200)
    .json(
        new ApiResponse(200,{isEmailVerified:true},"User verification has been successful")
    )
})


//Function to resend Email verification
//Email verification can be present only if email is not verified and after emailVerficationExpiry
//Apply these 2 checks then repeat same 4&5 step of registerUser: Attach UT,HT and tokenExpiry then send Email
const resendEmailVerification=asyncHandler(async (req,res)=>{
    const user=req.user
    //Verification email should not be resent if user is already verified
    if(user.isEmailVerified){
        throw new ApiError(409,"Email already verified")
    }

    //Verification email should be resent only after emailVerificationExpiry
    if(user.emailVerificationExpiry &&
    user.emailVerificationExpiry>Date.now()){
        throw new ApiError(408,"Verification email already sent. Please wait sometime before resending")
    }

    //Repeat 4th and 5th step of registerUser: Attact UT,HT and tokenExpiry and sendEmail
    //4. Saving user in DB with UT,HT and tokenExpiry
    const {unHashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken()

    user.emailVerificationToken=hashedToken
    user.emailVerificationExpiry=tokenExpiry
    await user.save({validateBeforeSave:false})

    //5. Verify user by Email
    await sendEmail(
        {
            email:user?.email,
            subject:"Please verify your email",
            mailgenContent:emailVerificationMailgenContent(user.username, 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Verification email has been resent successfully"))
})


//Function to refresh the access token
//Since refreshToken is used to refresh the accessToken: fetch incoming refreshToken, decode and verify it with refreshToken stored in DB, then generate new accessToken and refreshToken
const refreshAccessToken=asyncHandler(async (req,res)=>{
    //1. Fetch incoming refreshToken through cookies or body
    const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Access")
    }

    //2. Decode to find user(using jwt.verify()) and verify it with refreshToken of user stored in DB (coz we need to extract user from DB from id stored in refreshToken)
    try {
        //Since its token with data,thats why needed to decode then match
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        const user=await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(407,"Invalid Refresh Token")
        }

        if(incomingRefreshToken!==user.refreshToken){
            throw new ApiError(403,"Refresh token has expired")
        }

    //3. Generate new accessToken and refreshToken. Send both to user as cookie and save refreshToken in DB
    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)
    //Saving new refresh Token in database
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})

    //Sending both to user as cookie
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken},
            "Access token has been refreshed successfully"
        )
    )
    } catch (error) {
        console.log(error)
        throw new ApiError(401,"Invalid Refresh Token")
    }

})


//Function to handle forgotPassword Request
//In forgotPassword mechanism: client sends his email address, server checks if email exists in DB, then sends email to that email address that leads to reset password mechanism
//Take email address of client, verify if it exists in DB and repeat 4th&5th step of registerUser: Attach UT,HT and tokenExpiry then send Email
const forgotPasswordRequest=asyncHandler(async (req,res)=>{
    //1. Take email address of client
    const {email}=req.body

    //2. verify if it exists in DB
    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    //3. Repeat 4th&5th step of registerUser: Attach UT,HT and tokenExpiry then send Email
    const {unHashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken()
    //Save hashedToken and tokenExpiry in DB and send unhashedToken in email (same mechanism)
    user.forgotPasswordToken=hashedToken
    user.forgotPasswordExpiry=tokenExpiry
    await user.save({validateBeforeSave:false})

    await sendEmail(
        {
            email:user?.email,
            subject:"Click on this link to reset your password",
            mailgenContent:forgotPasswordMailgenContent(user.username, 
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`)     //We can use dynamic link or static link both
        }
    )
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Email to reset password sent successfully")
    )
})


//Function to reset Forgot Password
//Take resetToken and newPassword from request, verify resetToken and update password of user
const resetForgotPassword=asyncHandler(async (req,res) => {
    //1. Take resetToken and newPassword from request
    const {resetToken}=req.params       //Reset token must be present as parameter in url(or route)
    const {newPassword}=req.body
    const {confirmPassword}=req.body

    //2. Verify resetToken (resetToken is unHashed token, so hash it then match it with one stored in DB)
    let hashedToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    //Same DB query method to find matching user in DB (req.user will fail here because user is not loggedIn and does not have accessToken)
    //Since resetToken is tokenWithoutData, no need to decode, Directly match
    const user=await User.findOne({forgotPasswordToken:hashedToken,
        forgotPasswordExpiry:{$gt: Date.now()}
    })
    if(!user){
        throw new ApiError(404,"Invalid Reset Token")
    }

    if(newPassword!==confirmPassword){
        throw new ApiError(408,"PAsswords dont match")
    }

    //3. Update Password of user and clear DB
    user.password=newPassword
    await user.save({validateBeforeSave:false})

    user.forgotPasswordExpiry=undefined
    user.forgotPasswordToken=undefined

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password has been reset successfully")
    )
})


//Function to change Password (For user who is already loggedIn)
//req.user works only when user is loggedIn otherwise you need to run a query in DB to find matching user
//Take old and new password, verify old password and change to new password
const changeCurrentPassword=asyncHandler(async (req,res) => {
    //1. Take old and new password (from req.body)
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user?._id)

    //2. Verify old password (By using method attached to model)
    const isPasswordValid=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(408,"Invalid Old Password")
    }

    //3. Change to new password and save
    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password changed successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken,
    forgotPasswordRequest,
    resetForgotPassword,
    changeCurrentPassword
}       