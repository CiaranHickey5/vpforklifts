const express = require('express');
const router = express.Router();
const { upload, uploadToS3, deleteFromS3 } = require('../config/s3');

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('📤 Image upload request received');

    // Validate file presence
    if (!req.file) {
      console.log('❌ No file provided');
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Log file details
    console.log('📁 File details:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: `${(req.file.size / 1024).toFixed(2)} KB`
    });

    // Validate file size
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }

    // Upload to S3
    const uploadResult = await uploadToS3(req.file);
    
    const uploadTime = Date.now() - startTime;
    console.log(`✅ Upload completed in ${uploadTime}ms`);

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        imageUrl: uploadResult.location,
        key: uploadResult.key,
        size: req.file.size,
        uploadTime: `${uploadTime}ms`
      },
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    const uploadTime = Date.now() - startTime;
    console.error(`❌ Upload failed after ${uploadTime}ms:`, error.message);

    // Handle specific AWS errors
    if (error.code === 'NoSuchBucket') {
      return res.status(500).json({
        success: false,
        message: 'Storage configuration error'
      });
    }

    if (error.code === 'AccessDenied') {
      return res.status(500).json({
        success: false,
        message: 'Storage access denied'
      });
    }

    if (error.code === 'NetworkingError') {
      return res.status(500).json({
        success: false,
        message: 'Network error during upload'
      });
    }

    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }

    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Upload failed. Please try again',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete image
router.delete('/image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    console.log('🗑️ Delete request for:', imageUrl);

    // Validate imageUrl
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    // Validate S3 URL format
    if (!imageUrl.includes('amazonaws.com') || !imageUrl.includes(process.env.S3_BUCKET_NAME)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid S3 image URL'
      });
    }

    // Delete from S3
    await deleteFromS3(imageUrl);

    console.log('✅ Image deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete failed:', error.message);

    if (error.code === 'NoSuchKey') {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    if (error.code === 'AccessDenied') {
      return res.status(500).json({
        success: false,
        message: 'Delete access denied'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Delete failed. Please try again',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check for upload service
router.get('/health', async (req, res) => {
  try {
    // Test S3 connection
    const s3 = require('../config/s3').s3;
    await s3.headBucket({ Bucket: process.env.S3_BUCKET_NAME }).promise();
    
    res.status(200).json({
      success: true,
      message: 'Upload service healthy',
      timestamp: new Date().toISOString(),
      bucket: process.env.S3_BUCKET_NAME,
      region: process.env.AWS_REGION
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload service unhealthy',
      error: error.message
    });
  }
});

module.exports = router;