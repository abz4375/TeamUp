import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../../models/projectModel';
import mongoose from 'mongoose'; // Import mongoose
import { User } from '../../../../models/userModel';
// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI+'')
//   .then(() => console.log('mongo connected'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));

export async function GET(request: NextRequest) {

  // .then(() => console.log('mongo connected'))
  // .catch(err => console.error('Error connecting to MongoDB:', err));
  try {
    // Connect to MongoDB before using the User model
    // await mongoose.connect(process.env.MONGODB_URI+'')
    // console.log('mongo connected')

      const queryParams = new URLSearchParams(request.nextUrl.searchParams);
      // const id: any = queryParams.get('id') || null;
      // const firstName: any = queryParams.get('firstName') || null; // Get first-name param (optional)
      // const lastName: any = queryParams.get('lastName') || null;
      // const username: any = queryParams.get('username'); // Get username param (optional)
      // const password: any = queryParams.get('password') || null;
      // const emailId: any = queryParams.get('emailId') || null;
      // const projects: any = queryParams.get('projects') || null;
      // const tasks: any = queryParams.get('tasks') || null;
      // const contributions: any = queryParams.get('contributions') || null;
      const id: any = queryParams.get('id') || null;
      const info: any = queryParams.get('info') || null;
    //   const searchTermRegex = new RegExp(searchTerm);
      // console.log('search term regex: ',searchTermRegex)
      // console.log('search term: ', searchTerm)

      // Build the filter object based on user input
      const filter: any = {}; // Define filter with User interface
      // if (id) filter.id = id;
      // if (firstName) {
      //   filter.firstName = firstName;
      // }
      // if (lastName) {
      //   filter.lastName = lastName;
      // }
      // if (username) filter.username = username;
      // if (password) filter.password = password;
      // if (emailId) filter.emailId = emailId;
      // if (projects) filter.projects = projects;
      // if (tasks) filter.tasks = tasks;
      // if (contributions) filter.contributions = contributions;
      if (id) filter._id = id;
      
      // console.log("query given: ", filter)
      const project = await Project.find(filter); // Find users based on the filter

      if (!project.length) {
        return NextResponse.json({ message: 'Invalid Project ID' }, { status: 404 });
      }

      // console.log('project is' , project)
      if (info==='forDashboard'){
        const owner = await User.findOne({emailId:await project[0]?.owner});
        // console.log('owner is',await owner)
        return NextResponse.json({ title: await project[0].title, ownerName: await owner.name, ownerPic: await owner.profilePic, ownerEmailId: await owner.emailId, updatedAt: await project[0].updatedAt }, { status: 200 });
      } 
      else return NextResponse.json(project, { status: 200 });
    } catch (error) {
      // console.error(error);
      // console.log('')
      return NextResponse.json({ message: 'Error fetching info' }, { status: 500 });
    } finally {
      // Close the connection if needed (optional)
      // await mongoose.disconnect();
    }
  // }
}