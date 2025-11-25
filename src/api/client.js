/**
 * Axios Client Configuration
 * Centralized HTTP client with interceptors
 */
import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
  timeout: 30000, // 30 seconds timeout
});

/**
 * Request Interceptor
 * Add token or modify request before sending
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage (check common key variants)
    const token =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle responses and errors globally
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Return data directly for successful responses
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Check if this is a token refresh request that failed
          // Normalize url check to handle absolute or relative URLs
          const origUrl = String(originalRequest.url || '');
          if (origUrl.includes('/api/auth/refresh')) {
            // Refresh token is also expired, logout user
            isRefreshing = false;
            processQueue(error, null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
            return Promise.reject(error);
          }
          // If we haven't tried to refresh yet
          if (!originalRequest._retry) {
            if (isRefreshing) {
              // If already refreshing, queue this request
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers = originalRequest.headers || {};
                  originalRequest.headers['Authorization'] = 'Bearer ' + token;
                  return apiClient(originalRequest);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            // Try to get refresh token from common keys
            const refreshToken =
              localStorage.getItem('refreshToken') ||
              localStorage.getItem('refresh_token') ||
              localStorage.getItem('token_refresh');

            if (!refreshToken) {
              // No refresh token available, redirect to login
              toast.error('Session expired. Please login again.');
              window.location.href = '/login';
              return Promise.reject(error);
            }

            try {
              // Build refresh URL from environment or apiClient baseURL
              const base = import.meta.env.VITE_API_BASE_URL || apiClient.defaults.baseURL || 'http://localhost:5000';
              const refreshUrl = `${base.replace(/\/$/, '')}/api/auth/refresh`;

              // Use plain axios (no interceptors) to avoid recursion
              const response = await axios.post(
                refreshUrl,
                { refreshToken },
                { withCredentials: true }
              );

              const { accessToken, refreshToken: newRefreshToken } = response.data || {};

              if (!accessToken) {
                throw new Error('No access token returned from refresh');
              }

              // Store new tokens
              localStorage.setItem('accessToken', accessToken);
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
              }

              // Update axios instance default header so future requests use the new token
              apiClient.defaults.headers = apiClient.defaults.headers || {};
              apiClient.defaults.headers.common = apiClient.defaults.headers.common || {};
              apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

              // Update the original request with new token
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

              // Process all queued requests
              processQueue(null, accessToken);
              isRefreshing = false;

              // Retry the original request
              return apiClient(originalRequest);
            } catch (refreshError) {
              // Refresh failed, logout user
              processQueue(refreshError, null);
              isRefreshing = false;
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              toast.error('Session expired. Please login again.');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Let the service handle specific error messages
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
