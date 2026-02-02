//Create validators to validate input data
import {body} from "express-validator"

//Validation method: Returns an array after validating input fields by validation methods and message
const userRegisterValidator=() => {
    return [
        body("email")
        .trim()
        .notEmpty()         //These are validations that I run on input fields along with message
        .withMessage("Email is required")   //Attach withMessage after validation method to show a message if a validation fails
        .isEmail()
        .withMessage("Please enter valid email"),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min:3})          //Min 3 chars in username
        .withMessage("Username must be aleast 3 characters long"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min:8})
        .withMessage("Password must be atleast 8 characters long"),
        body("fullname")
        .optional()
        .trim()

    ]
}

const userLoginValidator=() => {
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid E-mail or Password"),
        body("password")
        .notEmpty()
        .withMessage("Password is required")
    ]
}

const userChangeCurrentPasswordValidator=() => {
    return [
        body("oldPassword")
        .notEmpty()
        .withMessage("Old Password is required "),
        body("newPassword")
        .notEmpty()
        .withMessage("New Password is required")
    ]
}

const userForgotPasswordValidator=()=>{
    return [
        body("email")
        .notEmpty()
        .withMessage("Email address is required")
        .isEmail()
        .withMessage("Invalid Email")
    ]
}

const userResetForgotPasswordValidator=()=>{
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("Password is required")
    ]
}

export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
}
//Here we have written validator for registerUser. 
//Similarly we can write validator for login Route, passwordReset Route and other routes