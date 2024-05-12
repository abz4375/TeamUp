import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../models/userModel';
import mongoose from 'mongoose'; // Import mongoose

const MONGO_URI = 'mongodb://localhost:27017/teamup';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB before using the User model
    await mongoose.connect(MONGO_URI);

    const queryParams = new URLSearchParams(request.nextUrl.searchParams);
    const id: any = queryParams.get('id') || null;
    const firstName: any = queryParams.get('firstName') || null; // Get first-name param (optional)
    const lastName: any = queryParams.get('lastName') || null;
    const username: any = queryParams.get('username'); // Get username param (optional)
    const password: any = queryParams.get('password') || null;
    const emailId: any = queryParams.get('emailId') || null;
    const projects: any = queryParams.get('projects') || null;
    const tasks: any = queryParams.get('tasks') || null;
    const contributions: any = queryParams.get('contributions') || null;


    // Build the filter object based on user input
    const filter: any = {}; // Define filter with User interface
    if (id) filter.id = id;
    if (firstName) {
      filter.firstName = firstName;
    }
    if (lastName) {
      filter.lastName = lastName;
    }
    if (username) filter.username = username;
    if (password) filter.password = password;
    if (emailId) filter.emailId = emailId;
    if (projects) filter.projects = projects;
    if (tasks) filter.tasks = tasks;
    if (contributions) filter.contributions = contributions;

    // console.log("query given: ", filter)
    const users = await User.find(filter); // Find users based on the filter

    if (!users.length) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  } finally {
    // Close the connection if needed (optional)
    await mongoose.disconnect();
  }
}