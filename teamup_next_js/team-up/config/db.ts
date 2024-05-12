'use server'

import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/teamup")
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error)
    }
}
