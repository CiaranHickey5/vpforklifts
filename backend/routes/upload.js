const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `forklift-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// @route   POST /api/upload/image
// @desc    Upload forklift image
// @access  Private (Admin only)
router.post("/image", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Return the file URL that can be accessed publicly
    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
});

// @route   DELETE /api/upload/image/:filename
// @desc    Delete uploaded image
// @access  Private (Admin only)
router.delete("/image/:filename", auth, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
  } catch (error) {
    console.error("Image delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
    });
  }
});

module.exports = router;
