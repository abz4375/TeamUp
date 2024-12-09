import { NextRequest, NextResponse } from 'next/server';
import { Task } from '../../../../../models/taskModel';
import { createApiResponse } from '../../utils/apiHandler';
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
      return NextResponse.json(
        createApiResponse(false, null, 'Task not found', 404),
        { headers: { 'Cache-Control': 'no-store' }}
      );
    }

    task.submitted = true;
    await task.save();

    return NextResponse.json(
      createApiResponse(true, { task }, 'Task submitted successfully'),
      { 
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
      }
    );

  } catch (error) {
    return NextResponse.json(
      createApiResponse(false, null, 'Error submitting task', 500),
      { headers: { 'Cache-Control': 'no-store' }}
    );
  }
}
