'use server'
import mongoose from "mongoose"

export const connectDB = async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI+'', {
            maxPoolSize: 50,  // Optimized pool size
            minPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxIdleTimeMS: 30000,
            compressors: "zlib"  // Network compression
        });
    }
};