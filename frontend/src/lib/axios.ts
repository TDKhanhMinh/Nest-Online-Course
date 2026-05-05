import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiSuccessResponse, ApiErrorResponse } from "../types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Map the raw response to ApiSuccessResponse class
    return new ApiSuccessResponse(response.data) as any;
  },
  (error: AxiosError) => {
    // Map the error response to ApiErrorResponse class
    if (error.response && error.response.data) {
      return Promise.reject(new ApiErrorResponse(error.response.data));
    }

    // Handle global errors here (e.g., network errors or unexpected format)
    return Promise.reject(
      new ApiErrorResponse({
        statusCode: error.status || 500,
        error: error.name,
        message_code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    );
  }
);

export default api;
