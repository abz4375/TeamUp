// Create a new file at /src/app/api/utils/errorHandler.ts
export const handleApiError = (error: any) => {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message || 'Internal server error',
      status: error.status || 500
    };
  };
  