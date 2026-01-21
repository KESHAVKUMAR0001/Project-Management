import express from "express"
import cors from "cors"         //Cross Origin Resource sharing
import cookieParser from "cookie-parser"   //TO access cookies in expressJS


const app=express()         //Creating Express application (http request handler)

// Basic configurations: Using middlewares
app.use(express.json({limit:"16kb"}))      // To accept JSON data in my application so that anyone can send me JSON data
app.use(express.urlencoded({extended:true,limit:"16kb"}))  //To accept URL encoded data in my application
app.use(express.static("public"))   //To define static assets(images, css) in webpage (which can be publicly viewable)


//CORS configurations
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",  //Is orirgin se request aane pe server k data access kar skta hai. CORS origin is basically a frontend url
    credentials:true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],    //Methods supported in request
    allowedHeaders: ["Authorization", "Content-Type"]
}))

app.use(cookieParser());            //To have access to cookies

//3. Registering route in main app
//import the routes, Define final route (acording to PRD) and serve router
import healthCheckRouter from "./routes/heathcheck.routes.js"
app.use("/api/v1/healthcheck",healthCheckRouter)  //Using middleware, defining route and passing router. Overall route will become /api/v1/healthcheck/

import authRouter from "./routes/auth.routes.js"
app.use("/api/v1/auth",authRouter)     //Final path will become /api/v1/auth/register         

app.get("/",(req,res)=>{    //Routing by ExpressJS=> Kisi particular route p request aaye toh kaise handle krna hai
    res.send("Welcome to basecampy")
})


export default app