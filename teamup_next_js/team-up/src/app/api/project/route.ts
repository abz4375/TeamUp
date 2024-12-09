import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../../models/projectModel';
import { User } from '../../../../models/userModel';
import { Task } from '../../../../models/taskModel';
import mongoose from 'mongoose';
import { connectDB } from '../../../../config/db';
import { handleApiError } from "@/app/api/utils/errorHandler";
import { createApiResponse } from '../utils/apiResponse';
/*
// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI+'')
//   .then(() => console.log('mongo connected'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));
*/

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Extend timeout to 60 seconds


export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const queryParams = new URLSearchParams(request.nextUrl.searchParams);
    const id = queryParams.get('id');
    
    const filter: any = {};
    if (id) filter._id = id;
    
    const project = await Project.find(filter);
    
    return NextResponse.json(
      createApiResponse(true, project, 'Project retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      createApiResponse(false, null, errorResponse.message, errorResponse.status),
      { status: errorResponse.status }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const emailId = body.userEmail;
  const toDelete = body.toDelete;
  const toLeave = body.toLeave;

  if (toDelete) {
    console.log('toDelete part executed')
    try {
      await connectDB();
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
      await connectDB();
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

        // Get tasks assigned to the leaving user for this project
        const userTasks = await Task.find({ 
          projectId: projectId,
          assignees: emailId 
        });

        // Remove these tasks from the leaving user
        if (userTasks.length > 0) {
          // Remove task IDs from the user document
          await User.findOneAndUpdate(
            { emailId: emailId },
            { $pull: { tasks: { $in: userTasks.map(task => task._id) } } }
          );

          // Delete the tasks where this user was the only assignee
          await Task.deleteMany({
            projectId: projectId,
            assignees: { $size: 1, $elemMatch: { $eq: emailId } }
          });

          // Remove this user from assignees in tasks with multiple assignees
          await Task.updateMany(
            { 
              projectId: projectId,
              assignees: emailId
            },
            { $pull: { assignees: emailId } }
          );
        }

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

// Add this PUT function to the existing route.ts file
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI+'', {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
      });
    }

    const body = await request.json();
    const { projectId, description } = body;

    if (!projectId || description === undefined) {
      return NextResponse.json(
        { message: 'Project ID and description are required' },
        { status: 400 }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { description: description },
      { new: true } // Returns the updated document
    );

    if (!updatedProject) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Description updated successfully', project: updatedProject },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating project description:', error);
    return NextResponse.json(
      { message: 'Error updating project description' },
      { status: 500 }
    );
  }
}