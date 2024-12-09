// src/app/api/utils/apihandler.ts
type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    status: number;
  };
  
  export function createApiResponse<T>(
    success: boolean,
    data?: T,
    error?: string,
    status: number = 200
  ): ApiResponse<T> {
    return {
      success,
      data,
      error,
      status
    };
  }  