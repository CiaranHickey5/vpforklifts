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
  Visibility,
  VisibilityOff,
  Security,
} from "@mui/icons-material";
import { useApp } from "../../context/AppContext";

// Simple Login Modal Component
const LoginModal = () => {
  const { handleLogin, setShowLoginModal, showLoginModal, loading, error } =
    useApp();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const usernameRef = useRef();

  // Focus username field when modal opens
  useEffect(() => {
    if (showLoginModal && usernameRef.current) {
      setTimeout(() => usernameRef.current.focus(), 100);
    }
  }, [showLoginModal]);

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const result = await handleLogin(formData.username, formData.password);

    // If login successful, the modal will be closed by the context
    if (result && result.success) {
      setFormData({ username: "", password: "" });
      setValidationErrors({});
      setShowPassword(false);
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setFormData({ username: "", password: "" });
    setValidationErrors({});
    setShowPassword(false);
  };

  if (!showLoginModal) return null;

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
              Admin Login
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
            {/* Error Messages */}
            {error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}

            {/* Development Notice */}
            <Alert severity="info" variant="outlined">
              <Typography variant="body2">
                <strong>Development Access</strong>
                <br />
                Default credentials: admin / admin123
              </Typography>
            </Alert>

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
              disabled={loading}
              autoComplete="username"
              required
            />

            {/* Password Field */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleInputChange("password")}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={loading}
              autoComplete="current-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
              loading || !formData.username.trim() || !formData.password
            }
            startIcon={loading ? null : <Login />}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Keep the existing DeleteConfirmModal unchanged
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
      <LoginModal />
      {showDeleteConfirm && <DeleteConfirmModal />}
    </>
  );
};

export default Modals;
