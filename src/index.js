import dotenv from "dotenv"   // Importing any package in NodeJS
import app from "./app.js"    // Importing all code of ExpressJS in object-app
import connectDB from "./db/index.js"   //Import function that connects server to database

dotenv.config({
    path:"./.env",
})


const port = process.env.PORT || 3000   //Defining port of server

connectDB()                     //Server will listen to port only when it gets connected to database
  .then(()=>{
    app.listen(port, () => {     //Web server is listening on given port. Internally express does: http.createServer(app).listen(3000);
  console.log(`Example app listening on http://localhost:${port}`)
  })
  }) 
  .catch((err)=> {
    console.error("MongoDB connection error",err)
    process.exit(1)
  })