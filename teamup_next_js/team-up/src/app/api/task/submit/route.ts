import { NextRequest, NextResponse } from 'next/server';
import { Task } from '../../../../../models/taskModel';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI+'', {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
      });
    }

    const { taskId, userEmail } = await request.json();

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }

    // Update task to mark as submitted
    task.submitted = true;
    await task.save();

    return NextResponse.json({ 
      success: true,
      message: 'Task submitted successfully',
      task
    });

  } catch (error) {
    console.error('Error submitting task:', error);
    return NextResponse.json(
      { success: false, message: 'Error submitting task' },
      { status: 500 }
    );
  }
}
