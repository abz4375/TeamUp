const mongoose = require('mongoose')

const connectDB = async () => {
    try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/teamup?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0")
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error){
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB