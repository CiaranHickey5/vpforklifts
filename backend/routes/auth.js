const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { validateInput, sanitizeInput } = require("../utils/validation");

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Sanitize inputs
    const cleanUsername = sanitizeInput(username);
    const cleanPassword = sanitizeInput(password);

    // Validate input lengths
    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Invalid username format",
      });
    }

    if (cleanPassword.length < 6 || cleanPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Invalid password format",
      });
    }

    // Find user and check credentials
    const user = await User.findByCredentials(cleanUsername, cleanPassword);

    // Generate tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken(
      req.get("User-Agent") || "Unknown",
      req.ip
    );

    // Save refresh token to user
    await user.save();

    // Set secure HTTP-only cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          lastLogin: user.lastLogin,
        },
        accessToken,
        expiresIn: process.env.JWT_EXPIRE || "24h",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public (requires refresh token)
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not provided",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if refresh token exists in user's tokens array
    const tokenExists = user.refreshTokens.some(
      (token) => token.token === refreshToken && token.expiresAt > new Date()
    );

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid",
      });
    }

    // Generate new access token
    const newAccessToken = user.generateAuthToken();

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        expiresIn: process.env.JWT_EXPIRE || "24h",
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (revoke refresh token)
// @access  Private
router.post("/logout", auth, async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Revoke the specific refresh token
      await req.user.revokeRefreshToken(refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices (revoke all refresh tokens)
// @access  Private
router.post("/logout-all", auth, async (req, res) => {
  try {
    // Revoke all refresh tokens
    await req.user.revokeAllRefreshTokens();

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    // Clean up expired refresh tokens
    await req.user.cleanupRefreshTokens();

    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role,
          permissions: req.user.permissions,
          lastLogin: req.user.lastLogin,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user information",
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    // Sanitize inputs
    const cleanCurrentPassword = sanitizeInput(currentPassword);
    const cleanNewPassword = sanitizeInput(newPassword);

    // Validate new password
    if (cleanNewPassword.length < 6 || cleanNewPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "New password must be between 6 and 128 characters",
      });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select("+password");

    // Verify current password
    const isMatch = await user.comparePassword(cleanCurrentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = cleanNewPassword;
    await user.save();

    // Revoke all refresh tokens (force re-login on all devices)
    await user.revokeAllRefreshTokens();

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
});

// @route   GET /api/auth/sessions
// @desc    Get active sessions
// @access  Private
router.get("/sessions", auth, async (req, res) => {
  try {
    // Clean up expired tokens first
    await req.user.cleanupRefreshTokens();

    const sessions = req.user.refreshTokens.map((token) => ({
      id: token._id,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      userAgent: token.userAgent,
      ipAddress: token.ipAddress,
      isCurrent: token.token === req.cookies.refreshToken,
    }));

    res.json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get sessions",
    });
  }
});

// @route   DELETE /api/auth/sessions/:sessionId
// @desc    Revoke specific session
// @access  Private
router.delete("/sessions/:sessionId", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Remove the specific session
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (token) => token._id.toString() !== sessionId
    );

    await req.user.save();

    res.json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    console.error("Revoke session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to revoke session",
    });
  }
});

module.exports = router;
