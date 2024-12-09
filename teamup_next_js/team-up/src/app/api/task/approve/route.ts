import { NextRequest, NextResponse } from 'next/server';
import { Task } from '../../../../../models/taskModel';
import { createApiResponse } from '../../utils/apiResponse';
import { handleApiError } from '../../utils/errorHandler';
import { connectDB } from '../../../../../config/db';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { taskId, maintainerEmail } = await request.json();
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        createApiResponse(false, null, 'Task not found', 404)
      );
    }
    
    // Add maintainer to approvals if not already present
    if (!task.approvals.includes(maintainerEmail)) {
      task.approvals.push(maintainerEmail);
      await task.save();
    }
    
    return NextResponse.json(
      createApiResponse(true, task, 'Task approved successfully')
    );
    
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      createApiResponse(false, null, errorResponse.message, errorResponse.status),
      { status: errorResponse.status }
    );
  }
}
