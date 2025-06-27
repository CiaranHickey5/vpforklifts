import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { initialForklifts } from "../data/initialData";
import { securityUtils } from "../utils/security";

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

  // SECURE Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // Edit/Create state
  const [isEditing, setIsEditing] = useState(false);
  const [editingForklift, setEditingForklift] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // SECURE session management
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const encryptedSession = localStorage.getItem("virgil_admin_session");
        if (encryptedSession) {
          const session = securityUtils.decrypt(encryptedSession);

          if (session && session.expiresAt > Date.now()) {
            setIsAuthenticated(true);
            setSessionData(session);

            // Set auto-logout timer
            const timeUntilExpiry = session.expiresAt - Date.now();
            setTimeout(() => {
              handleLogout();
            }, timeUntilExpiry);
          } else {
            // Session expired
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        handleLogout();
      }
    };

    initializeAuth();
  }, []);

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Navigation functions
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    setSelectedForklift(null);
    setError(null);
  }, []);

  // SECURE Authentication functions using VITE environment variables
  const handleLogin = useCallback(
    async (username, password) => {
      setLoading(true);
      setError(null);

      try {
        // Check if account is locked
        if (lockoutUntil && Date.now() < lockoutUntil) {
          const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
          throw new Error(
            `Account locked. Try again in ${minutesLeft} minutes.`
          );
        }

        // Sanitize inputs
        const cleanUsername = securityUtils.sanitizeInput(username);
        const cleanPassword = securityUtils.sanitizeInput(password);

        // Validate inputs
        if (!cleanUsername || !cleanPassword) {
          throw new Error("Please enter both username and password");
        }

        // Check credentials against VITE environment variables
        const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME;
        const expectedPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

        if (!expectedUsername || !expectedPasswordHash) {
          throw new Error("Authentication system not properly configured");
        }

        const providedPasswordHash = securityUtils.hashPassword(cleanPassword);

        if (
          cleanUsername === expectedUsername &&
          providedPasswordHash === expectedPasswordHash
        ) {
          // Successful login - create secure session
          const sessionToken = securityUtils.generateSessionToken();
          const sessionTimeout =
            parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000; // 1 hour

          const session = {
            token: sessionToken,
            username: cleanUsername,
            loginTime: Date.now(),
            expiresAt: Date.now() + sessionTimeout,
            role: "admin",
          };

          // Encrypt and store session
          const encryptedSession = securityUtils.encrypt(session);
          if (encryptedSession) {
            localStorage.setItem("virgil_admin_session", encryptedSession);
            setIsAuthenticated(true);
            setSessionData(session);
            setShowLoginModal(false);
            setLoginAttempts(0);
            setLockoutUntil(null);
            setError(null);

            // Set auto-logout timer
            setTimeout(() => {
              handleLogout();
            }, sessionTimeout);

            return { success: true };
          } else {
            throw new Error("Failed to create secure session");
          }
        } else {
          // Failed login
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);

          const maxAttempts =
            parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 3;

          if (newAttempts >= maxAttempts) {
            const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 minutes
            setLockoutUntil(lockoutTime);
            throw new Error(
              `Too many failed attempts. Account locked for 15 minutes.`
            );
          } else {
            const attemptsLeft = maxAttempts - newAttempts;
            throw new Error(
              `Invalid credentials. ${attemptsLeft} attempts remaining.`
            );
          }
        }
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [loginAttempts, lockoutUntil]
  );

  const handleLogout = useCallback(() => {
    // Clear all authentication data
    localStorage.removeItem("virgil_admin_session");
    setIsAuthenticated(false);
    setSessionData(null);
    setCurrentPage("home");
    setEditingForklift(null);
    setIsEditing(false);
    setLoginAttempts(0);
    setLockoutUntil(null);
    setError(null);
  }, []);

  // Update session activity (call this on user interactions)
  const updateSessionActivity = useCallback(() => {
    if (isAuthenticated && sessionData) {
      const sessionTimeout =
        parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000;
      const updatedSession = {
        ...sessionData,
        lastActivity: Date.now(),
        expiresAt: Date.now() + sessionTimeout,
      };

      const encryptedSession = securityUtils.encrypt(updatedSession);
      if (encryptedSession) {
        localStorage.setItem("virgil_admin_session", encryptedSession);
        setSessionData(updatedSession);
      }
    }
  }, [isAuthenticated, sessionData]);

  // SECURE CRUD Functions with input sanitization
  const handleCreateForklift = useCallback(() => {
    if (!isAuthenticated) {
      setError("Authentication required");
      return;
    }

    updateSessionActivity(); // Update session on user activity

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
  }, [forklifts, isAuthenticated, updateSessionActivity]);

  const handleDeleteForklift = useCallback(
    (id) => {
      if (!isAuthenticated) {
        setError("Authentication required");
        return;
      }

      try {
        updateSessionActivity(); // Update session on user activity

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
    [selectedForklift, isAuthenticated, updateSessionActivity]
  );

  const handleSaveForklift = useCallback(
    (forkliftData) => {
      if (!isAuthenticated) {
        setError("Authentication required");
        return;
      }

      try {
        setLoading(true);
        updateSessionActivity(); // Update session on user activity

        // SANITIZE all input data
        const sanitizedData = {
          ...forkliftData,
          model: securityUtils.sanitizeInput(forkliftData.model || ""),
          sku: securityUtils.sanitizeInput(forkliftData.sku || ""),
          description: securityUtils.sanitizeInput(
            forkliftData.description || ""
          ),
          capacity: securityUtils.sanitizeInput(forkliftData.capacity || ""),
          lift: securityUtils.sanitizeInput(forkliftData.lift || ""),
          hirePrice: securityUtils.sanitizeInput(forkliftData.hirePrice || ""),
          image: securityUtils.sanitizeInput(forkliftData.image || ""),
          features: Array.isArray(forkliftData.features)
            ? forkliftData.features.map((f) => securityUtils.sanitizeInput(f))
            : [],
          specs:
            typeof forkliftData.specs === "object"
              ? Object.fromEntries(
                  Object.entries(forkliftData.specs).map(([k, v]) => [
                    securityUtils.sanitizeInput(k),
                    securityUtils.sanitizeInput(v),
                  ])
                )
              : {},
        };

        // Validate required fields
        if (
          !sanitizedData.model ||
          !sanitizedData.sku ||
          !sanitizedData.price
        ) {
          throw new Error("Please fill in all required fields");
        }

        const formattedPrice = `€${sanitizedData.price.toLocaleString()}`;
        const updatedForklift = {
          ...sanitizedData,
          priceFormatted: formattedPrice,
        };

        // Check if editing existing or creating new
        const existingIndex = forklifts.findIndex(
          (f) => f.id === sanitizedData.id
        );

        if (existingIndex !== -1) {
          // Update existing
          setForklifts((prevForklifts) =>
            prevForklifts.map((f) =>
              f.id === sanitizedData.id ? updatedForklift : f
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
    [forklifts, isAuthenticated, updateSessionActivity]
  );

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    // State
    currentPage,
    isMenuOpen,
    forklifts,
    selectedForklift,
    isAuthenticated,
    sessionData,
    showLoginModal,
    isEditing,
    editingForklift,
    showDeleteConfirm,
    deleteId,
    loading,
    error,
    loginAttempts,
    lockoutUntil,

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
    updateSessionActivity,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
