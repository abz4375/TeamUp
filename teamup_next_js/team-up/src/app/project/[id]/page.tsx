import { handleApiResponse } from "@/utils/apiHandler";

// src/app/project/[id]/page.tsx
async function getProjectData(id: string) {
    const response = await fetch(`/api/project/${id}/dashboard`, {
      next: {
        revalidate: 60, // Matches the 60-second cache we set on the API
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleApiResponse(response);
  }
  