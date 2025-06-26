import React, { useState } from "react";
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
} from "@mui/material";
import { Close, Login, Warning } from "@mui/icons-material";
import { useApp } from "../../context/AppContext";

// Login Modal Component
const LoginModal = () => {
  const { handleLogin, setShowLoginModal, showLoginModal } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    if (username === "admin" && password === "Virgil1973") {
      handleLogin(username, password);
      setError("");
      setUsername("");
      setPassword("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setError("");
    setUsername("");
    setPassword("");
  };

  return (
    <Dialog
      open={showLoginModal}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Login color="primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Admin Login
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Delete Confirmation Modal Component
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
