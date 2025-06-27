import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { initialForklifts } from "../data/initialData";

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
  const [forklifts, setForklifts] = useState(initialForklifts);
  const [selectedForklift, setSelectedForklift] = useState(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously authenticated (optional persistence)
    return localStorage.getItem("virgil_admin_auth") === "true";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Edit/Create state
  const [isEditing, setIsEditing] = useState(false);
  const [editingForklift, setEditingForklift] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Persist authentication state
  useEffect(() => {
    localStorage.setItem("virgil_admin_auth", isAuthenticated.toString());
  }, [isAuthenticated]);

  // Navigation functions
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    setSelectedForklift(null);
    setError(null);
  }, []);

  // Authentication functions
  const handleLogin = useCallback((username, password) => {
    setLoading(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      if (username === "admin" && password === "Virgil1973") {
        setIsAuthenticated(true);
        setShowLoginModal(false);
        setError(null);
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 500);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage("home");
    setEditingForklift(null);
    setIsEditing(false);
    localStorage.removeItem("virgil_admin_auth");
  }, []);

  // CRUD Functions with error handling
  const handleCreateForklift = useCallback(() => {
    const maxId =
      forklifts.length > 0 ? Math.max(...forklifts.map((f) => f.id)) : 0;
    const newForklift = {
      id: maxId + 1,
      sku: "",
      brand: "Toyota",
      model: "",
      type: "Electric",
      category: "electric",
      capacity: "",
      lift: "",
      price: 0,
      priceFormatted: "€0",
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
  }, [forklifts]);

  const handleDeleteForklift = useCallback(
    (id) => {
      try {
        setForklifts((prevForklifts) =>
          prevForklifts.filter((f) => f.id !== id)
        );
        setShowDeleteConfirm(false);
        setDeleteId(null);

        // If the deleted forklift was currently selected, clear selection
        if (selectedForklift?.id === id) {
          setSelectedForklift(null);
        }
      } catch (err) {
        setError("Failed to delete forklift");
        console.error("Delete error:", err);
      }
    },
    [selectedForklift]
  );

  const handleSaveForklift = useCallback(
    (forkliftData) => {
      try {
        setLoading(true);

        // Validate required fields
        if (!forkliftData.model || !forkliftData.sku || !forkliftData.price) {
          throw new Error("Please fill in all required fields");
        }

        const formattedPrice = `€${forkliftData.price.toLocaleString()}`;
        const updatedForklift = {
          ...forkliftData,
          priceFormatted: formattedPrice,
          // Ensure features is an array
          features: Array.isArray(forkliftData.features)
            ? forkliftData.features
            : [],
          // Ensure specs is an object
          specs:
            typeof forkliftData.specs === "object" ? forkliftData.specs : {},
        };

        // Check if editing existing or creating new
        const existingIndex = forklifts.findIndex(
          (f) => f.id === forkliftData.id
        );

        if (existingIndex !== -1) {
          // Update existing
          setForklifts((prevForklifts) =>
            prevForklifts.map((f) =>
              f.id === forkliftData.id ? updatedForklift : f
            )
          );
        } else {
          // Add new
          setForklifts((prevForklifts) => [...prevForklifts, updatedForklift]);
        }

        setIsEditing(false);
        setEditingForklift(null);
        setCurrentPage("admin");
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Save error:", err);
      } finally {
        setLoading(false);
      }
    },
    [forklifts]
  );

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Close menu when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  const value = {
    // State
    currentPage,
    isMenuOpen,
    forklifts,
    selectedForklift,
    isAuthenticated,
    showLoginModal,
    isEditing,
    editingForklift,
    showDeleteConfirm,
    deleteId,
    loading,
    error,

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
    handleDeleteForklift,
    handleSaveForklift,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
