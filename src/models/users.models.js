//Creating database schema and model (How data will be stored in database)
//Attaching Hooks and Methods to schema

import mongoose,{Schema} from "mongoose"   //Since we're using mongoDB, mongoose is ORM that we need to use
import bcrypt from "bcrypt"                //For encrypting any field of schema, bcrypt module is used
import jwt from "jsonwebtoken"             //For creating tokenWithData (accessToken and refreshToken)
import crypto from "crypto"                //For creating token without data, use crypto module of nodeJS

const userSchema=new Schema(        //Creating new Schema ({fields},{timestamps})
    {
        avatar:{                //Storing image of user in DB. Image will have some url and its localpath
            type:{
                url:String,
                localPath:String,
            },
            default:{           //If user is not providing any of avatar, what to store in DB
                url:`https://placehold.co/100x100`,
                localPath:"",
            }
        },
        username:{
            type:String,
            required:true,      //In this way we can do DB validations in mongoose
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:String,
            trim:true
        },
        password:{
            type:String,
            required:[true,"Password is required"]   //Custom error will be passed if field is not stored by user    
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{                  //Storing Refresh token in DB
            type:String
        },
        forgotPasswordToken:{           //TO support functionality of forgot  password
            type:String
        },
        forgotPasswordExpiry:{
            type:Date
        },
        emailVerificationToken:{
            type:String
        },
        emailVerificationExpiry:{
            type:Date
        }
    },
    {
        timestamps:true              //2 Fields will be autoAdded if timeStamps is true: createdAt and updatedAt
    }
)      

//To attach PreHooks to Schema: for encrypting password before exporting model
//Use PreHooks by: userSchema.pre(DB_Operation,function)
//.isModified(fields): Used To check fields modified in this save operation
userSchema.pre("save",async function(){ 
    //This preHook should run only when you modify password field of schema
    if(!this.isModified("password"))
        return

    this.password=await bcrypt.hash(this.password,10)       //bcrypt.hash(fieldToHash,numberOfRounds)
})

//To attach methods to Schema: To check if password is correct or not
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)     //COmpares and checks if hash values of 2 passwords same or not
}

//Attach methods to schema: To generate access token
export const User=mongoose.model("User",userSchema)