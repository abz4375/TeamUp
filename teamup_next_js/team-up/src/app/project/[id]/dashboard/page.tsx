// src/app/project/[id]/dashboard/page.tsx
import { handleApiResponse } from '@/utils/apiHandler';

interface DashboardData {
  title: string;
  ownerName: string;
  ownerPic: string;
  ownerEmailId: string;
  updatedAt: string;
}

async function getDashboardData(id: string): Promise<DashboardData> {
  const response = await fetch(`/api/project/${id}/dashboard`, {
    next: {
      revalidate: 60,
    },
  });
  
  return handleApiResponse<DashboardData>(response);
}
