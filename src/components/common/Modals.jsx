import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  IconButton,
  Box,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import { 
  Close, 
  Login, 
  Warning, 
  Visibility, 
  VisibilityOff,
  Security,
  Shield
} from "@mui/icons-material";
import { useApp } from "../../context/AppContext";

// Enhanced Login Modal Component with Security
const LoginModal = () => {
  const { 
    handleLogin, 
    setShowLoginModal, 
    showLoginModal, 
    loading,
    error,
    loginAttempts,
    lockoutUntil 
  } = useApp();
  
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const usernameRef = useRef();

  // Focus username field when modal opens
  useEffect(() => {
    if (showLoginModal && usernameRef.current) {
      setTimeout(() => usernameRef.current.focus(), 100);
    }
  }, [showLoginModal]);

  // Handle lockout countdown
  useEffect(() => {
    if (lockoutUntil) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, lockoutUntil - Date.now());
        setLockoutTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      errors.username = 'Username is too long';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 128) {
      errors.password = 'Password is too long';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Basic input length limits for security
    const maxLengths = { username: 50, password: 128 };
    if (value.length > maxLengths[field]) {
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    // Check if account is locked
    if (lockoutUntil && Date.now() < lockoutUntil) {
      return;
    }

    await handleLogin(formData.username, formData.password);
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setFormData({ username: "", password: "" });
    setValidationErrors({});
    setShowPassword(false);
  };

  const isLocked = lockoutUntil && Date.now() < lockoutUntil;
  const maxAttempts = parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS) || 3;
  const attemptsRemaining = Math.max(0, maxAttempts - loginAttempts);

  return (
    <Dialog
      open={showLoginModal}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
      disableEscapeKeyDown={loading}
    >
      {loading && <LinearProgress color="primary" />}
      
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Security color="primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Admin Access
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={3}>
            {/* Security Warning */}
            <Alert 
              severity="info" 
              icon={<Shield />}
              variant="outlined"
            >
              <Typography variant="body2">
                <strong>Secure Admin Access</strong><br />
                This area requires administrator credentials. All login attempts are monitored.
              </Typography>
            </Alert>

            {/* Error Messages */}
            {error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}

            {/* Lockout Warning */}
            {isLocked && (
              <Alert severity="warning" variant="filled">
                <Typography variant="body2">
                  <strong>Account Temporarily Locked</strong><br />
                  Time remaining: {Math.ceil(lockoutTimeRemaining / 1000 / 60)} minutes
                </Typography>
              </Alert>
            )}

            {/* Attempts Warning */}
            {!isLocked && loginAttempts > 0 && (
              <Alert severity="warning" variant="outlined">
                <Typography variant="body2">
                  <strong>Warning:</strong> {attemptsRemaining} attempts remaining before account lockout
                </Typography>
              </Alert>
            )}

            {/* Username Field */}
            <TextField
              ref={usernameRef}
              label="Username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={handleInputChange("username")}
              error={!!validationErrors.username}
              helperText={validationErrors.username}
              disabled={loading || isLocked}
              autoComplete="username"
              required
              inputProps={{
                maxLength: 50,
                pattern: "[a-zA-Z0-9_]+",
                title: "Username can only contain letters, numbers, and underscores"
              }}
            />

            {/* Password Field */}
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleInputChange("password")}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={loading || isLocked}
              autoComplete="current-password"
              required
              inputProps={{
                maxLength: 128
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading || isLocked}
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Security Notice */}
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                🔒 Your connection is secured with encryption<br />
                📊 Login attempts are logged for security monitoring<br />
                ⏰ Sessions automatically expire for your protection
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={
              loading || 
              isLocked || 
              !formData.username.trim() || 
              !formData.password
            }
            startIcon={loading ? null : <Login />}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Keep your existing DeleteConfirmModal unchanged
const DeleteConfirmModal = () => {
  const {
    handleDeleteForklift,
    setShowDeleteConfirm,
    setDeleteId,
    deleteId,
    showDeleteConfirm,
  } = useApp();

  const handleConfirmDelete = () => {
    handleDeleteForklift(deleteId);
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  return (
    <Dialog
      open={showDeleteConfirm}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Warning color="error" />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Confirm Delete
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to delete this forklift? This action cannot be
          undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Modals Component
const Modals = () => {
  const { showLoginModal, showDeleteConfirm } = useApp();

  return (
    <>
      {showLoginModal && <LoginModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
    </>
  );
};

export default Modals;