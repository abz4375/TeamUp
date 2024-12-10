// src/app/api/project/[id]/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../../../../models/projectModel';
import { Task } from '../../../../../../models/taskModel';
import { createApiResponse } from '../../../utils/apiHandler';
import mongoose from 'mongoose';

export const revalidate = 60 // Cache project data for 60 seconds
export const maxDuration = 60

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectStats = await Project.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(params.id) }},
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'projectId',
          as: 'tasks'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'contributors',
          foreignField: 'emailId',
          as: 'contributorDetails'
        }
      },
      {
        $project: {
          title: 1,
          totalTasks: { $size: '$tasks' },
          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'completed'] }
              }
            }
          },
          activeContributors: {
            $size: {
              $filter: {
                input: '$contributorDetails',
                as: 'contributor',
                cond: { $gt: ['$lastActive', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] }
              }
            }
          }
        }
      }
    ]);

    if (!projectStats.length) {
      return NextResponse.json(
        createApiResponse(false, null, 'Project not found', 404),
        { headers: { 'Cache-Control': 'no-store' }}
      );
    }

    return NextResponse.json(
      createApiResponse(true, projectStats[0]),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      createApiResponse(false, null, 'Error fetching project statistics', 500),
      { headers: { 'Cache-Control': 'no-store' }}
    );
  }
}
