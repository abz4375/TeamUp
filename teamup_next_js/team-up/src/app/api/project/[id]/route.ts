// src/app/api/project/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../../../models/projectModel';
import { User } from '../../../../../models/userModel';
import mongoose from 'mongoose';
import { apiLimiter } from '../../middleware/rateLimits';

export const revalidate = 60 // Cache project data for 60 seconds
export const maxDuration = 60

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await apiLimiter(request);
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ message: 'Invalid Project ID' }, { 
        status: 404,
        headers: {
          'Cache-Control': 'no-store' // Don't cache errors
        }
      });
    }

    return NextResponse.json(project, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching info' }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
