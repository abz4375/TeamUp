// Create a new file at /src/app/api/utils/apiResponse.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    status: number;
  }
  
  export function createApiResponse<T>(
    success: boolean,
    data?: T,
    message?: string,
    status: number = 200
  ): ApiResponse<T> {
    return {
      success,
      data,
      message,
      status
    };
  }
  