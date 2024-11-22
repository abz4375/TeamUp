import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../../models/projectModel';
import { User } from '../../../../models/userModel';
import { Task } from '../../../../models/taskModel';
import mongoose from 'mongoose';
/*
// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI+'')
//   .then(() => console.log('mongo connected'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));
*/

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Extend timeout to 60 seconds


export async function GET(request: NextRequest) {

  /*
  // .then(() => console.log('mongo connected'))
  // .catch(err => console.error('Error connecting to MongoDB:', err));
  */

  try {
    /*
    // Connect to MongoDB before using the User model
    // await mongoose.connect(process.env.MONGODB_URI+'')
    // console.log('mongo connected')
    */
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI+'', {
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 15000,
      });
  }
    const queryParams = new URLSearchParams(request.nextUrl.searchParams);
    /*
    // const id: any = queryParams.get('id') || null;
    // const firstName: any = queryParams.get('firstName') || null; // Get first-name param (optional)
    // const lastName: any = queryParams.get('lastName') || null;
    // const username: any = queryParams.get('username'); // Get username param (optional)
    // const password: any = queryParams.get('password') || null;
    // const emailId: any = queryParams.get('emailId') || null;
    // const projects: any = queryParams.get('projects') || null;
    // const tasks: any = queryParams.get('tasks') || null;
    // const contributions: any = queryParams.get('contributions') || null;
    */
// Retrieves 'id' and 'info' values from URL query parameters, defaulting to null if not found.
    const id: any = queryParams.get('id') || null;
    const info: any = queryParams.get('info') || null;
    /*
    //   const searchTermRegex = new RegExp(searchTerm);
    // console.log('search term regex: ',searchTermRegex)
    // console.log('search term: ', searchTerm)
    

    // Build the filter object based on user input
    */
    const filter: any = {}; // Define filter with User interface
    /*
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
    */

    if (id) filter._id = id;

    // console.log("query given: ", filter)
    const project = await Project.find(filter); // Find users based on the filter

    if (!project.length) {
      return NextResponse.json({ message: 'Invalid Project ID' }, { status: 404 });
    }

    // console.log('project is' , project)
    if (info === 'forDashboard') {
      const owner = await User.findOne({ emailId: await project[0]?.owner });
      // console.log('owner is',await owner)
      return NextResponse.json({ title: await project[0].title, ownerName: await owner.name, ownerPic: await owner.profilePic, ownerEmailId: await owner.emailId, updatedAt: await project[0].updatedAt }, { status: 200 });
    } else if (info === 'forDeletePage') {
      return NextResponse.json({ title: await project[0].title, owner: await project[0].owner, createdAt: await project[0].createdAt.getDate() + ' - ' + (await project[0].createdAt.getMonth() + 1) + ' - ' + (await project[0].createdAt.getYear() - 100 + 2000) }, { status: 200 });
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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const emailId = body.userEmail;
  const toDelete = body.toDelete;
  const toLeave = body.toLeave;

  if (toDelete) {
    console.log('toDelete part executed')
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI+'', {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 15000,
        });
    }
      for (const projectId of toDelete) {
        const project = await Project.findOne({ _id: projectId });
        if (!project) continue;

        // 1. Get all tasks associated with the project
        const projectTasks = await Task.find({ projectId: projectId });

        // 2. Remove tasks from all users who have these tasks
        for (const task of projectTasks) {
            await User.updateMany(
                { tasks: task._id },
                { $pull: { tasks: task._id } }
            );
        }

        // 3. Delete all tasks associated with the project
        await Task.deleteMany({ projectId: projectId });
        
        for (const contributorEmail of project.contributors) {
          const user = await User.findOne({ emailId: contributorEmail });
          if (!user) continue;
          
          const index = user.projects.indexOf(projectId);
          if (index > -1) {
            user.projects.splice(index, 1);
            await user.save();
          }
        }
        
        await Project.deleteOne({ _id: projectId });
      }
      return NextResponse.json({ message: 'success' }, { status: 200 });
    } catch (error) {
      console.error('Error in toDelete:', error);
      return NextResponse.json({ message: 'Error in deletion process' }, { status: 500 });
    }
  }

  if (toLeave) {
    console.log('toLeave part executed')
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI+'', {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 15000,
        });
    }
      for (const projectId of toLeave) {
        const project = await Project.findOne({ _id: projectId });
        if (!project) continue;

        const maintainers = project.maintainers;
        if (maintainers.indexOf(emailId) > -1) {
          if (maintainers.length === 1) maintainers.push(project.owner);
          maintainers.splice(maintainers.indexOf(emailId), 1);
        }

        const contributors = project.contributors;
        const contributorIndex = contributors.indexOf(emailId);
        if (contributorIndex > -1) {
          contributors.splice(contributorIndex, 1);
        }

        await project.save();

        const user = await User.findOne({ emailId: emailId });
        if (user) {
          const index = user.projects.indexOf(projectId);
          if (index > -1) {
            user.projects.splice(index, 1);
            await user.save();
          }
        }
      }
      return NextResponse.json({ message: 'success' }, { status: 200 });
    } catch (error) {
      console.error('Error in toLeave:', error);
      return NextResponse.json({ message: 'Error in leaving process' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'No action performed' }, { status: 400 });
}
