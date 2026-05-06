import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiErrorResponse, ApiSuccessResponse } from "../types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout to prevent hanging requests
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
    // The response.data from Backend already has { statusCode, message_code, data, timestamp }
    // We wrap it in ApiSuccessResponse and return it directly,
    // so consumers receive ApiSuccessResponse (not AxiosResponse)
    return new ApiSuccessResponse(response.data) as any;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - clear stale auth and redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        
        // Only redirect if not already on an auth page to avoid redirect loops
        if (!window.location.pathname.includes("/auth")) {
          window.location.href = "/auth/login";
        }
      }
    }

    // Map the error response to ApiErrorResponse class
    if (error.response && error.response.data) {
      return Promise.reject(new ApiErrorResponse(error.response.data));
    }

    // Handle network errors, timeouts, or unexpected format
    const isTimeout = error.code === "ECONNABORTED";
    return Promise.reject(
      new ApiErrorResponse({
        statusCode: error.status || 500,
        error: isTimeout ? "Request Timeout" : error.name,
        message_code: isTimeout ? "REQUEST_TIMEOUT" : "INTERNAL_SERVER_ERROR",
        message: isTimeout
          ? "Request timed out. Please check your connection and try again."
          : error.message || "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      })
    );
  }
);

export default api;
