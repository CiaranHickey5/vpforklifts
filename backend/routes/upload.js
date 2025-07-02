const express = require('express');
const router = express.Router();
const { upload, deleteFromS3 } = require('../config/s3');

// Upload single image
router.post('/image', (req, res) => {
  console.log('📤 Upload request received');
  
  upload.single('image')(req, res, (err) => {
    try {
      if (err) {
        console.error('❌ Multer upload error:', err);
        
        // Handle specific multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB'
          });
        }
        
        if (err.message === 'Only image files are allowed!') {
          return res.status(400).json({
            success: false,
            message: 'Only image files are allowed'
          });
        }

        // AWS S3 errors
        if (err.code === 'NoSuchBucket') {
          console.error('S3 Bucket not found:', process.env.S3_BUCKET_NAME);
          return res.status(500).json({
            success: false,
            message: 'Storage configuration error'
          });
        }

        if (err.code === 'AccessDenied') {
          console.error('S3 Access denied - check IAM permissions');
          return res.status(500).json({
            success: false,
            message: 'Storage access denied'
          });
        }

        return res.status(500).json({
          success: false,
          message: 'Upload failed',
          error: err.message
        });
      }

      if (!req.file) {
        console.log('❌ No file in request');
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      console.log('✅ File uploaded successfully:', {
        originalName: req.file.originalname,
        size: req.file.size,
        location: req.file.location,
        key: req.file.key
      });

      res.json({
        success: true,
        data: {
          imageUrl: req.file.location,
          key: req.file.key,
          size: req.file.size,
        },
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('❌ Unexpected upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message
      });
    }
  });
});

// Delete image
router.delete('/image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    console.log('🗑️ Delete request for:', imageUrl);
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    await deleteFromS3(imageUrl);
    
    console.log('✅ Image deleted successfully');
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

module.exports = router;