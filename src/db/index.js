//File to connect server to database

import mongoose from "mongoose"   //Import ORM layer for MongoDB

//Function to connect to database
const connectDB=async() => {     
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error",error)
        process.exit(1)
    }
}


export default connectDB   //Exporting mongoDB connection so that it can be used independently