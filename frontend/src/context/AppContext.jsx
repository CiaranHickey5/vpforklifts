import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI, forkliftAPI, apiUtils } from "../services/api";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Navigation state
  const [currentPage, setCurrentPage] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Product state
  const [forklifts, setForklifts] = useState([]);
  const [selectedForklift, setSelectedForklift] = useState(null);
  const [forkliftStats, setForkliftStats] = useState(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Edit/Create state
  const [isEditing, setIsEditing] = useState(false);
  const [editingForklift, setEditingForklift] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, []);

  // Listen for auth logout events (from API interceptors)
  useEffect(() => {
    const handleAuthLogout = () => {
      handleLogout();
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Initialize app state
  const initializeApp = async () => {
    try {
      setInitialLoading(true);

      // Check if user is authenticated
      if (apiUtils.isAuthenticated()) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear it
          apiUtils.clearAuthToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      }

      // Load initial forklifts
      await loadForklifts();

      // Load stats
      await loadForkliftStats();
    } catch (error) {
      console.error("App initialization error:", error);
      setError("Failed to initialize application");
    } finally {
      setInitialLoading(false);
    }
  };

  // Load forklifts from API
  const loadForklifts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await forkliftAPI.getForklifts(params);
      setForklifts(response.data.forklifts);
      return response;
    } catch (error) {
      console.error("Load forklifts error:", error);
      setError(apiUtils.handleError(error));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load forklift statistics
  const loadForkliftStats = async () => {
    try {
      const response = await forkliftAPI.getStats();
      setForkliftStats(response.data);
    } catch (error) {
      console.warn("Load stats error:", error);
      // Stats are not critical, so don't show error to user
    }
  };

  // Navigation functions
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    setSelectedForklift(null);
    setError(null);
  }, []);

  // Authentication functions
  const handleLogin = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      // Basic input validation
      if (!username?.trim() || !password?.trim()) {
        throw new Error("Please enter both username and password");
      }

      const response = await authAPI.login(username.trim(), password);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setShowLoginModal(false);
        setError(null);

        return { success: true };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local state regardless of API call result
      apiUtils.clearAuthToken();
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage("home");
      setEditingForklift(null);
      setIsEditing(false);
      setError(null);
      setLoading(false);
    }
  }, []);

  // Forklift CRUD functions
  const handleCreateForklift = useCallback(() => {
    if (!isAuthenticated) {
      setError("Authentication required");
      return;
    }

    const newForklift = {
      sku: "",
      brand: "Toyota",
      model: "",
      type: "Electric",
      capacity: "",
      lift: "",
      price: 0,
      hirePrice: "€0/week",
      status: "In Stock",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22df5ddc37?w=600&h=400&fit=crop",
      features: [],
      description: "",
      specs: {},
    };

    setEditingForklift(newForklift);
    setIsEditing(true);
    setCurrentPage("admin-edit");
  }, [isAuthenticated]);

  const handleSaveForklift = useCallback(
    async (forkliftData) => {
      if (!isAuthenticated) {
        setError("Authentication required");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let response;
        if (forkliftData._id) {
          // Update existing forklift
          response = await forkliftAPI.updateForklift(
            forkliftData._id,
            forkliftData
          );
        } else {
          // Create new forklift
          response = await forkliftAPI.createForklift(forkliftData);
        }

        if (response.success) {
          // Reload forklifts to get updated data
          await loadForklifts();

          setIsEditing(false);
          setEditingForklift(null);
          setCurrentPage("admin");
          setError(null);
        } else {
          throw new Error(response.message || "Failed to save forklift");
        }
      } catch (error) {
        const errorMessage = apiUtils.handleError(error);
        setError(errorMessage);
        console.error("Save forklift error:", error);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const handleDeleteForklift = useCallback(
    async (id) => {
      if (!isAuthenticated) {
        setError("Authentication required");
        return;
      }

      try {
        setLoading(true);
        const response = await forkliftAPI.deleteForklift(id);

        if (response.success) {
          // Remove from local state immediately for better UX
          setForklifts((prevForklifts) =>
            prevForklifts.filter((f) => f._id !== id)
          );

          // Clear any references to the deleted forklift
          if (selectedForklift?._id === id) {
            setSelectedForklift(null);
          }

          setShowDeleteConfirm(false);
          setDeleteId(null);
          setError(null);

          // Reload stats
          await loadForkliftStats();
        } else {
          throw new Error(response.message || "Failed to delete forklift");
        }
      } catch (error) {
        const errorMessage = apiUtils.handleError(error);
        setError(errorMessage);
        console.error("Delete forklift error:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedForklift, isAuthenticated]
  );

  // Get single forklift (for detail view)
  const getForklift = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await forkliftAPI.getForklift(id);

      if (response.success) {
        setSelectedForklift(response.data.forklift);
        return response.data.forklift;
      } else {
        throw new Error(response.message || "Forklift not found");
      }
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search and filter forklifts
  const searchForklifts = useCallback(async (searchParams) => {
    return await loadForklifts(searchParams);
  }, []);

  // Get featured forklifts
  const getFeaturedForklifts = useCallback(async (limit = 6) => {
    try {
      const response = await forkliftAPI.getFeaturedForklifts(limit);
      return response.data.forklifts;
    } catch (error) {
      console.error("Get featured forklifts error:", error);
      return [];
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Utility function to check permissions
  const hasPermission = useCallback(
    (resource, action) => {
      if (!user || !user.permissions) return false;
      return user.permissions[resource]?.[action] === true;
    },
    [user]
  );

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      console.error("Refresh user error:", error);
      // If refresh fails, user might need to re-login
      await handleLogout();
    }
  }, [isAuthenticated, handleLogout]);

  const value = {
    // State
    currentPage,
    isMenuOpen,
    forklifts,
    selectedForklift,
    forkliftStats,
    isAuthenticated,
    user,
    showLoginModal,
    isEditing,
    editingForklift,
    showDeleteConfirm,
    deleteId,
    loading,
    error,
    initialLoading,

    // Setters
    setCurrentPage,
    setIsMenuOpen,
    setSelectedForklift,
    setShowLoginModal,
    setIsEditing,
    setEditingForklift,
    setShowDeleteConfirm,
    setDeleteId,

    // Functions
    navigateTo,
    handleLogin,
    handleLogout,
    handleCreateForklift,
    handleSaveForklift,
    handleDeleteForklift,
    loadForklifts,
    searchForklifts,
    getForklift,
    getFeaturedForklifts,
    refreshUser,
    clearError,
    hasPermission,

    // API utilities
    api: {
      forklift: forkliftAPI,
      auth: authAPI,
      utils: apiUtils,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
