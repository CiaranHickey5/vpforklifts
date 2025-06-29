const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and loads user
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token is for access (not refresh)
      if (decoded.type === "refresh") {
        return res.status(401).json({
          success: false,
          message: "Invalid token type",
        });
      }

      // Get user from database
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Token is no longer valid. User not found or inactive.",
        });
      }

      // Check if user account is locked
      if (user.isLocked) {
        return res.status(401).json({
          success: false,
          message: "Account is temporarily locked",
        });
      }

      // Check if password was changed after token was issued
      if (user.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({
          success: false,
          message: "Password was recently changed. Please log in again.",
        });
      }

      // Add user to request
      req.user = user;
      req.token = token;

      next();
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);

      let message = "Invalid token";

      if (jwtError.name === "TokenExpiredError") {
        message = "Token has expired. Please log in again.";
      } else if (jwtError.name === "JsonWebTokenError") {
        message = "Invalid token format";
      } else if (jwtError.name === "NotBeforeError") {
        message = "Token not active";
      }

      return res.status(401).json({
        success: false,
        message,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication service error",
    });
  }
};

/**
 * Permission checking middleware
 * Checks if user has specific permission for a resource and action
 */
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    try {
      // User should be loaded by auth middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Check if user has the required permission
      const hasPermission =
        req.user.permissions &&
        req.user.permissions[resource] &&
        req.user.permissions[resource][action] === true;

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Missing permission: ${resource}:${action}`,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

/**
 * Role-based access control middleware
 * Checks if user has required role
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${roles.join(" or ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({
        success: false,
        message: "Role check failed",
      });
    }
  };
};

/**
 * Optional authentication middleware
 * Loads user if token is provided, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // No token provided, continue without user
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next(); // No token provided, continue without user
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type === "refresh") {
        return next(); // Invalid token type, continue without user
      }

      const user = await User.findById(decoded.id);

      if (
        user &&
        user.isActive &&
        !user.isLocked &&
        !user.changedPasswordAfter(decoded.iat)
      ) {
        req.user = user;
        req.token = token;
      }

      next();
    } catch (jwtError) {
      // Token is invalid, but continue without user
      console.warn("Optional auth token error:", jwtError.message);
      next();
    }
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next(); // Continue without user on error
  }
};

/**
 * Rate limiting by user middleware
 * Applies different rate limits for authenticated vs unauthenticated users
 */
const userBasedRateLimit = (authenticatedLimit, unauthenticatedLimit) => {
  const rateLimit = require("express-rate-limit");

  return (req, res, next) => {
    const limit = req.user ? authenticatedLimit : unauthenticatedLimit;

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: limit,
      keyGenerator: (req) => {
        return req.user ? req.user._id.toString() : req.ip;
      },
      message: {
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      },
    });

    limiter(req, res, next);
  };
};

/**
 * Activity tracking middleware
 * Updates user's last activity timestamp
 */
const trackActivity = async (req, res, next) => {
  try {
    if (req.user) {
      // Update last activity (fire and forget)
      User.findByIdAndUpdate(
        req.user._id,
        { lastLogin: new Date() },
        { new: false }
      )
        .exec()
        .catch((err) => {
          console.warn("Failed to update user activity:", err.message);
        });
    }
    next();
  } catch (error) {
    console.error("Activity tracking error:", error);
    next(); // Continue even if activity tracking fails
  }
};

/**
 * Session validation middleware
 * Ensures refresh token is still valid in user's active sessions
 */
const validateSession = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(); // No refresh token to validate
    }

    // Check if refresh token exists in user's active sessions
    const hasValidSession = req.user.refreshTokens.some(
      (token) => token.token === refreshToken && token.expiresAt > new Date()
    );

    if (!hasValidSession) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    next();
  } catch (error) {
    console.error("Session validation error:", error);
    next(); // Continue on error
  }
};

module.exports = {
  auth,
  checkPermission,
  requireRole,
  optionalAuth,
  userBasedRateLimit,
  trackActivity,
  validateSession,
};
