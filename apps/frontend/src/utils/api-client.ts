import axios, { AxiosError } from 'axios';
import { dispatchApiError } from '@/types/api-error.types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const statusCode = error.response?.status;

    if (statusCode && statusCode >= 500) {
      dispatchApiError({
        message: 'An unexpected error occurred. Please try again later.',
        statusCode,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
