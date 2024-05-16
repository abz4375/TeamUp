import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import mongoose from "mongoose";
import { User } from "../../../../models/userModel";

export async function GET(request:NextRequest) {
    const session = await auth();
    const googleUser =session?.user;

    // Find user in Database
    try {
        // Connect to MongoDB before using the User model
        await mongoose.connect(process.env.MONGODB_URI+'');
        const user = await User.find({emailId:googleUser?.email}); // Find users based on the filter
    
        if (!user.length) {
        //   return NextResponse.json({ message: 'No users found' }, { status: 404 });
            const newUser = new User({
                name: googleUser?.name,
                emailId: googleUser?.email,
                profilePic: googleUser?.image,
                projects: null,
                tasks: null,
                contributions: null
            });
            const userToSend = await newUser.save();
            return NextResponse.json(userToSend, { status: 200 });
        }
        return NextResponse.json(user, { status: 200 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching User\'s Info' }, { status: 500 });
      } finally {
        // Close the connection if needed (optional)
        await mongoose.disconnect();
      }
    // return NextResponse.json({ user: session?.user }, { status: 200 });
}