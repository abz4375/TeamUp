import { NextRequest, NextResponse } from 'next/server';
import { Task } from '../../../../../models/taskModel';
import { User } from '../../../../../models/userModel';
import { Project } from '../../../../../models/projectModel';
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

    const { taskId, maintainerEmail } = await request.json();

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }

    // Add maintainer to approvals if not already approved
    if (!task.approvals.includes(maintainerEmail)) {
      task.approvals.push(maintainerEmail);
      await task.save();

      // If all maintainers have approved, move task to contributions
      const project = await Project.findById(task.projectId);
      if (project && task.approvals.length === project.maintainers.length) {
        // Move task to contributions for each assignee
        for (const assigneeEmail of task.assignees) {
          const user = await User.findOne({ emailId: assigneeEmail });
          if (user) {
            user.tasks = user.tasks.filter((t:any) => t.toString() !== taskId);
            user.contributions.push(taskId);
            await user.save();
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Task approved successfully',
      approvals: task.approvals
    });

  } catch (error) {
    console.error('Error approving task:', error);
    return NextResponse.json(
      { success: false, message: 'Error approving task' },
      { status: 500 }
    );
  }
}
