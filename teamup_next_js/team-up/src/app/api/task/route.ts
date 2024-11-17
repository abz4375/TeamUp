import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { Task } from '../../../../models/taskModel';
import { User } from '../../../../models/userModel';
import { Project } from '../../../../models/projectModel';
import formidable, { Fields, Files } from 'formidable';
import { Readable } from 'stream';
import { IncomingMessage } from 'http';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Extend timeout to 60 seconds

// Define uploadDir constant
const uploadDir = join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    const { fields, fileUrl } = await parseForm(request, uploadDir);
    
    // Extract task details
    const description = Array.isArray(fields.description) 
      ? fields.description[0] 
      : fields.description || '';

    // Parse assignee emails from form data
    const assigneeEmails = fields.assignees 
      ? JSON.parse(Array.isArray(fields.assignees) ? fields.assignees[0] : fields.assignees) 
      : [];

    // Get project name from form data
    const projectName = Array.isArray(fields.projectName)
      ? fields.projectName[0]
      : fields.projectName || '';
      // console.log(projectName);
    
      const projectId = Array.isArray(fields.projectId)
      ? fields.projectId[0]
      : fields.projectId || '';

    // Create task in database
    const task = await Task.create({
      description,
      assignees: assigneeEmails,
      fileUrl,
      projectName, // Add project name
      projectId, //
      createdAt: new Date(),
    });

    // Update each assignee's user document
    for (const email of assigneeEmails) {
      await User.findOneAndUpdate(
        { emailId: email },
        { $push: { tasks: task._id } }
      );
    }

    // Update project document
    await Project.findByIdAndUpdate(
      projectId,
      { $push: { tasks: task._id } }
    );

    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      task: {
        id: task._id,
        description,
        assignees: assigneeEmails,
        fileUrl,
        projectName, // Include in response
        projectId, //
        createdAt: task.createdAt
      },
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating task' },
      { status: 500 }
    );
  }
}

async function parseForm(req: NextRequest, uploadDir: string): Promise<{ fields: Fields; fileUrl: string | null }> {
  return new Promise(async (resolve, reject) => {
    const form = formidable({ 
      uploadDir, 
      keepExtensions: true, 
      maxFileSize: 10 * 1024 * 1024,
      filename: (name, ext, path, form) => {
        return `${Date.now()}-${path}`;
      }
    });

    const chunks = [];
    const reader = req.body?.getReader();
    if (!reader) {
      reject(new Error('No request body'));
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    // Create a stream with all required IncomingMessage properties
    const stream = Object.assign(new Readable(), {
      aborted: false,
      complete: true,
      connection: null,
      headers: {} as Record<string, string>,
      headersDistinct: {},
      httpVersion: '1.1',
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      method: req.method,
      url: req.url,
      socket: null,
      statusCode: null,
      statusMessage: null,
      destroyed: false
    }) as unknown as IncomingMessage;

    stream.push(buffer);
    stream.push(null);

    // Add headers
    req.headers.forEach((value, key) => {
      stream.headers[key.toLowerCase()] = value;
    });

    form.parse(stream, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const fileUrl = file && file.newFilename
        ? `/uploads/${file.newFilename}`
        : null;

      resolve({ fields, fileUrl });
    });
  });
}

export async function GET(request: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI+'', {
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 15000,
      });
  }
    const taskId = request.nextUrl.searchParams.get('id');
    const projectId = request.nextUrl.searchParams.get('projectId');
    
    if (!taskId && !projectId) {
      return NextResponse.json(
        { success: false, message: 'Task ID is required' },
        { status: 400 }
      );
    }

    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        return NextResponse.json(
          { success: false, message: 'Project not found' },
          { status: 404 }
        );
      }
      
      // Fetch all tasks for the project
      const tasks = await Task.find({ projectId: projectId });
      
      return NextResponse.json({
        success: true,
        tasks: tasks.map(task => ({
          id: task._id,
          description: task.description,
          assignees: task.assignees,
          fileUrl: task.fileUrl,
          projectName: task.projectName,
          createdAt: task.createdAt
        }))
      });
    }

    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: {
        id: task._id,
        description: task.description,
        assignees: task.assignees,
        fileUrl: task.fileUrl,
        projectName: task.projectName, // Include project name in response
        createdAt: task.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching task' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs' // optional