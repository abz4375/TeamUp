import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../models/userModel';
import mongoose from 'mongoose'; // Import mongoose

const MONGO_URI = 'mongodb://localhost:27017/teamup';

// export async function POST(request: NextRequest) {
//     try {
//         // Connect to MongoDB before using the User model
//         await mongoose.connect(MONGO_URI);

//         const queryParams = new URLSearchParams(request.nextUrl.searchParams);
//         const id: any = queryParams.get('id') || null;
//         const firstName: any = queryParams.get('firstName') || null; // Get first-name param (optional)
//         const lastName: any = queryParams.get('lastName') || null;
//         const username: any = queryParams.get('username'); // Get username param (optional)
//         const password: any = queryParams.get('password') || null;
//         const emailId: any = queryParams.get('emailId') || null;
//         const projects: any = queryParams.get('projects') || null;
//         const tasks: any = queryParams.get('tasks') || null;
//         const contributions: any = queryParams.get('contributions') || null;


//         // Build the filter object based on user input
//         const userData: any = {}; // Define filter with User interface
//         if (id) userData.id = id;
//         if (firstName) userData.firstName = firstName;
//         if (lastName) userData.lastName = lastName;
//         if (username) userData.username = username;
//         if (password) userData.password = password;
//         if (emailId) userData.emailId = emailId;
//         if (projects) userData.projects = projects;
//         if (tasks) userData.tasks = tasks;
//         if (contributions) userData.contributions = contributions;

//         // console.log("query given: ", filter)
//         const newUser = new User(userData);
//         await newUser.save();

//         // if (!users.length) {
//         //   return NextResponse.json({ message: 'No users found' }, { status: 404 });
//         // }

//         return NextResponse.json({ message: 'User created successfully!', user: newUser }, { status: 201 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ message: 'Error creating users' }, { status: 500 });
//     } finally {
//         // Close the connection if needed (optional)
//         await mongoose.disconnect();
//     }
// }

// Connect to MongoDB (establish the connection only once)
mongoose.connect(MONGO_URI);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json(); // Parse the JSON data from the request body

        const userData = {
            firstName: body.firstName || null,
            lastName: body.lastName || null,
            username: body.username || null,
            password: body.password || null,
            emailId: body.emailId || null,
            projects: body.projects || null,
            tasks: body.tasks || null,
            contributions: body.contributions || null,
        };

        // Validate and sanitize input data (e.g., check for required fields)

        // console.log(userData)
        const newUser = new User(userData);
        await newUser.save();

        return NextResponse.json({ message: 'User created successfully!', user: newUser }, { status: 201 });
    } catch (error) {
        console.error('Error during user creation:', error);
        return NextResponse.json({ message: 'Error creating users' }, { status: 500 });
    }
}