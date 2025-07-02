import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://virgil-power-forklifts-api.onrender.com/api", // Always use production API
  timeout: 30000, // Increased timeout for file uploads
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

// Upload API methods - Updated for S3
export const uploadAPI = {
  // Upload image file to S3
  uploadImage: async (file) => {
    // Validate file before upload
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 1 minute timeout for uploads
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // You can emit custom events here for progress tracking
          window.dispatchEvent(
            new CustomEvent("upload:progress", {
              detail: { percent: percentCompleted },
            })
          );
        },
      });

      // Validate response
      if (!response.data.success) {
        throw new Error(response.data.message || "Upload failed");
      }

      // Ensure we have the image URL
      if (!response.data.data?.imageUrl) {
        throw new Error("Invalid response: missing image URL");
      }

      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            throw new Error(data.message || "Invalid file or request");
          case 413:
            throw new Error("File too large. Maximum size is 5MB");
          case 415:
            throw new Error(
              "Unsupported file type. Please use JPG, PNG, or GIF"
            );
          case 429:
            throw new Error("Too many uploads. Please try again later");
          case 500:
            throw new Error("Server error during upload. Please try again");
          default:
            throw new Error(data.message || "Upload failed");
        }
      } else if (error.request) {
        throw new Error(
          "Network error. Please check your connection and try again"
        );
      } else {
        throw error;
      }
    }
  },

  // Delete uploaded image from S3
  deleteImage: async (imageUrl) => {
    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    try {
      const response = await api.delete("/upload/image", {
        data: { imageUrl },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Delete failed");
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            throw new Error(data.message || "Invalid image URL");
          case 404:
            throw new Error("Image not found");
          case 500:
            throw new Error("Server error during deletion");
          default:
            throw new Error(data.message || "Delete failed");
        }
      } else if (error.request) {
        throw new Error("Network error. Please check your connection");
      } else {
        throw error;
      }
    }
  },

  // Get upload progress (for UI components)
  getUploadProgress: () => {
    return new Promise((resolve) => {
      const handleProgress = (event) => {
        resolve(event.detail.percent);
        window.removeEventListener("upload:progress", handleProgress);
      };
      window.addEventListener("upload:progress", handleProgress);
    });
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

        case 413:
          return "File too large. Please choose a smaller file.";

        case 415:
          return "Unsupported file type. Please use JPG, PNG, or GIF.";

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

  // Validate image file
  validateImageFile: (file) => {
    const errors = [];

    if (!file) {
      errors.push("No file selected");
      return errors;
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      errors.push("Invalid file type. Please use JPG, PNG, GIF, or WebP");
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push("File size must be less than 5MB");
    }

    // Check minimum dimensions (optional)
    return new Promise((resolve) => {
      if (errors.length > 0) {
        resolve(errors);
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          errors.push("Image must be at least 100x100 pixels");
        }
        resolve(errors);
      };
      img.onerror = () => {
        errors.push("Invalid image file");
        resolve(errors);
      };
      img.src = URL.createObjectURL(file);
    });
  },

  // Format file size for display
  formatFileSize: (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

// Export the main api instance for direct use if needed
export default api;
