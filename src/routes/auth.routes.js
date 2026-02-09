//To create route for registering user in Database

import { Router } from "express";
import { changeCurrentPassword, forgotPasswordRequest, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
verifyJWT

const router=Router()

//Secured and unsecured routes are mentioned in PRD of project
//Unsecured Routes (For controllers in which user is not already loggedIn and which dont need auth middleware to verify JWT)

//Route to registerUser
router.route("/register").post(userRegisterValidator(),
validate,registerUser)   // /register m post request aye toh registerUser controller serve krna h
//Since we are creating new data at server, we will use HTTP POST method

//Route to login user
router.route("/login").post(userLoginValidator(),
validate,loginUser)  // /login m post request aye toh login controller serve krna h

//Route to verify Email
router.route("/verify-email/:verificationToken").get(verifyEmail)   

//Route to refresh the accessToken
router.route("/refresh-token").post(refreshAccessToken)

//Route to handle forgot password request
router.route("/forgot-password").post(userForgotPasswordValidator(),
validate,forgotPasswordRequest)

//Route to Reset Forgot Password request
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),
validate,resetForgotPassword)


//Secured Routes (For controllers in which user is already loggedIn and which need auth middleware to verify JWT before serving controller)


//Route to logout user
router.route("/logout").post(verifyJWT,logoutUser)
// /logout m post request aye toh pehle run auth middleware, then serve logoutUser

//Route to get current user
router.route("/current-user").get(verifyJWT,getCurrentUser)

//Router to change password
router.route("/change-password").post(userChangeCurrentPasswordValidator(),
verifyJWT,changeCurrentPassword)

//Route to resend Email verification link
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification)


export default router

/*
Request comes -> Validator file runs and all validation rules gets applied and errors get attached to request
-> Middleware file runs, extracts errors from request and displays
-> controller registerUser or loginUser runs only when all data is valid
*/

/*
We call validator because it returns array of middlewares
for validation of fields. We dont call middleware because
it is the middleware and it handles itself (calls next middleware if no error). FOr all middlewares, we do the same
*/
