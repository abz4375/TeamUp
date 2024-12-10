// src/app/api/project/[id]/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../../../../models/projectModel';
import { User } from '../../../../../../models/userModel';
import { createApiResponse } from '../../../utils/apiHandler';

export const revalidate = 60 // Cache project data for 60 seconds
export const maxDuration = 60

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        createApiResponse(false, null, 'Invalid Project ID', 404),
        { headers: { 'Cache-Control': 'no-store' }}
      );
    }

    const owner = await User.findOne({ emailId: project.owner });
    return NextResponse.json(
      createApiResponse(true, {
        title: project.title,
        ownerName: owner.name,
        ownerPic: owner.profilePic,
        ownerEmailId: owner.emailId,
        updatedAt: project.updatedAt
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      createApiResponse(false, null, 'Error fetching dashboard info', 500),
      { headers: { 'Cache-Control': 'no-store' }}
    );
  }
}
