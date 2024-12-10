// src/app/api/project/[id]/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../../../../models/projectModel';
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

    return NextResponse.json(
      createApiResponse(true, {
        title: project.title,
        owner: project.owner,
        createdAt: `${project.createdAt.getDate()} - ${project.createdAt.getMonth() + 1} - ${project.createdAt.getYear() - 100 + 2000}`
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
      createApiResponse(false, null, 'Error fetching project info', 500),
      { headers: { 'Cache-Control': 'no-store' }}
    );
  }
}