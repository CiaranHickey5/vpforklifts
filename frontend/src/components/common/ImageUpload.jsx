import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  PhotoCamera,
  Image as ImageIcon,
} from "@mui/icons-material";

const ImageUpload = ({
  value,
  onChange,
  label = "Forklift Image",
  maxSize = 5, // MB
  accept = "image/*",
  height = 200,
  error,
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef();

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // For now, we'll convert to base64 for simple storage
      // In production, you'd upload to a cloud service
      const base64 = await convertToBase64(file);

      // Call the onChange callback with the base64 data
      onChange(base64);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to process image");
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
        {label}
      </Typography>

      <Card
        sx={{
          border: error
            ? "2px dashed #f44336"
            : dragOver
            ? "2px dashed #1976d2"
            : "2px dashed #e0e0e0",
          borderRadius: 2,
          backgroundColor: dragOver
            ? "rgba(25, 118, 210, 0.04)"
            : "transparent",
          transition: "all 0.3s ease",
          cursor: uploading ? "wait" : "pointer",
          position: "relative",
          overflow: "hidden",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!preview && !uploading ? openFileDialog : undefined}
      >
        {preview ? (
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height={height}
              image={preview}
              alt="Preview"
              sx={{ objectFit: "cover" }}
            />

            {/* Overlay with actions */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.3s ease",
                "&:hover": { opacity: 1 },
              }}
            >
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <PhotoCamera />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Box>

            {uploading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              height: height,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              textAlign: "center",
            }}
          >
            {uploading ? (
              <Stack spacing={2} alignItems="center">
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Processing image...
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2} alignItems="center">
                <ImageIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                <Typography variant="h6" color="text.secondary">
                  Click or drag image here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports JPG, PNG, WebP up to {maxSize}MB
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={openFileDialog}
                >
                  Choose File
                </Button>
              </Stack>
            )}
          </Box>
        )}
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />

      {/* Error message */}
      {error && helperText && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block" }}
        >
          {helperText}
        </Typography>
      )}

      {/* Help text */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        Recommended: 600x400px or larger for best quality
      </Typography>
    </Box>
  );
};

export default ImageUpload;
