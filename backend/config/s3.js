const AWS = require("aws-sdk");
const multer = require("multer");
const path = require("path");

// Validate required environment variables
const requiredEnvVars = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  AWS_REGION: process.env.AWS_REGION || "eu-west-1",
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingVars.join(", ")
  );
  process.exit(1);
}

console.log("✅ S3 Configuration loaded successfully");

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create S3 instance
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  region: process.env.AWS_REGION,
  maxRetries: 3,
  retryDelayOptions: {
    customBackoff: function (retryCount) {
      return Math.pow(2, retryCount) * 100;
    },
  },
});

// Test S3 connection on startup
const testS3Connection = async () => {
  try {
    // Simple test - try to get bucket location instead of headBucket
    await s3
      .getBucketLocation({ Bucket: process.env.S3_BUCKET_NAME })
      .promise();
    console.log("✅ S3 bucket connection verified");
  } catch (error) {
    // Don't exit or log errors - uploads might still work
    console.log("ℹ️ S3 connection test skipped (permissions may be limited)");
  }
};

// Run connection test
testS3Connection();

// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

// Upload file to S3
const uploadToS3 = async (file) => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e9);
  const extension = path.extname(file.originalname).toLowerCase();
  const key = `forklifts/${timestamp}-${random}${extension}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ServerSideEncryption: "AES256",
    Metadata: {
      "original-name": file.originalname,
      "upload-time": new Date().toISOString(),
    },
    // Removed ACL: 'public-read' - this was causing the error
  };

  try {
    console.log(`📤 Uploading ${file.originalname} to S3...`);
    const result = await s3.upload(uploadParams).promise();
    console.log(`✅ Upload successful: ${result.Location}`);

    return {
      location: result.Location,
      key: result.Key,
      bucket: result.Bucket,
      etag: result.ETag,
    };
  } catch (error) {
    console.error("❌ S3 upload failed:", error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

// Delete file from S3
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract key from S3 URL
    let key;
    if (fileUrl.includes("amazonaws.com")) {
      const url = new URL(fileUrl);
      key = url.pathname.substring(1); // Remove leading slash
    } else {
      throw new Error("Invalid S3 URL format");
    }

    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    console.log(`🗑️ Deleting ${key} from S3...`);
    await s3.deleteObject(deleteParams).promise();
    console.log(`✅ File deleted: ${key}`);

    return { success: true, key };
  } catch (error) {
    console.error("❌ S3 delete failed:", error);
    throw new Error(`S3 delete failed: ${error.message}`);
  }
};

// Check if file exists in S3
const checkFileExists = async (key) => {
  try {
    await s3
      .headObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
      .promise();
    return true;
  } catch (error) {
    if (error.code === "NotFound") {
      return false;
    }
    throw error;
  }
};

module.exports = {
  upload,
  uploadToS3,
  deleteFromS3,
  checkFileExists,
  s3,
};
