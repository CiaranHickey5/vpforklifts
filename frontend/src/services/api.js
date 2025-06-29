import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Token management
let authToken = localStorage.getItem("authToken");

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data.data;

        // Update token
        authToken = accessToken;
        localStorage.setItem("authToken", accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authToken = null;
        localStorage.removeItem("authToken");
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { accessToken } = response.data.data;

      // Store token
      authToken = accessToken;
      localStorage.setItem("authToken", accessToken);

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      // Always clear local auth state
      authToken = null;
      localStorage.removeItem("authToken");
    }
  },

  logoutAll: async () => {
    try {
      await api.post("/auth/logout-all");
    } catch (error) {
      console.warn("Logout all request failed:", error);
    } finally {
      authToken = null;
      localStorage.removeItem("authToken");
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get("/auth/sessions");
    return response.data;
  },

  revokeSession: async (sessionId) => {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  },
};

// Forklift API methods
export const forkliftAPI = {
  // Get all forklifts with filtering and pagination
  getForklifts: async (params = {}) => {
    const response = await api.get("/forklifts", { params });
    return response.data;
  },

  // Get single forklift by ID
  getForklift: async (id) => {
    const response = await api.get(`/forklifts/${id}`);
    return response.data;
  },

  // Get featured forklifts
  getFeaturedForklifts: async (limit = 6) => {
    const response = await api.get("/forklifts/featured", {
      params: { limit },
    });
    return response.data;
  },

  // Get forklift statistics
  getStats: async () => {
    const response = await api.get("/forklifts/stats");
    return response.data;
  },

  // Create new forklift (admin only)
  createForklift: async (forkliftData) => {
    const response = await api.post("/forklifts", forkliftData);
    return response.data;
  },

  // Update forklift (admin only)
  updateForklift: async (id, forkliftData) => {
    const response = await api.put(`/forklifts/${id}`, forkliftData);
    return response.data;
  },

  // Delete forklift (admin only)
  deleteForklift: async (id) => {
    const response = await api.delete(`/forklifts/${id}`);
    return response.data;
  },

  // Restore forklift (admin only)
  restoreForklift: async (id) => {
    const response = await api.post(`/forklifts/${id}/restore`);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Set auth token (used after successful login)
  setAuthToken: (token) => {
    authToken = token;
    localStorage.setItem("authToken", token);
  },

  // Clear auth token
  clearAuthToken: () => {
    authToken = null;
    localStorage.removeItem("authToken");
  },

  // Get current auth token
  getAuthToken: () => {
    return authToken || localStorage.getItem("authToken");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return Boolean(authToken || localStorage.getItem("authToken"));
  },

  // Handle API errors consistently
  handleError: (error) => {
    console.error("API Error:", error);

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          window.dispatchEvent(new CustomEvent("auth:logout"));
          return "Authentication required. Please log in.";

        case 403:
          return "Access denied. You do not have permission to perform this action.";

        case 404:
          return "Resource not found.";

        case 429:
          return "Too many requests. Please try again later.";

        case 500:
          return "Server error. Please try again later.";

        default:
          return data?.message || "An unexpected error occurred.";
      }
    } else if (error.request) {
      // Network error
      return "Network error. Please check your internet connection.";
    } else {
      // Other error
      return error.message || "An unexpected error occurred.";
    }
  },

  // Create query string from params object
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });

    return searchParams.toString();
  },

  // Upload file (if implementing file upload)
  uploadFile: async (file, endpoint = "/upload") => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    throw new Error("API health check failed");
  }
};

// Initialize auth token on app start
const initializeAuth = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    authToken = token;
  }
};

// Call on module load
initializeAuth();

// Export the configured axios instance for direct use if needed
export default api;
