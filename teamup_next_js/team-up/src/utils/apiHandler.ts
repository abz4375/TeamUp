// src/utils/apiHandler.ts
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    status: number;
  }
  
  export async function handleApiResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'An error occurred');
    }
    return data.data as T;
  }
  