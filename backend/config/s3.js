const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Debug: Log environment variables (safely)
console.log('🔍 Environment Variables Check:');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
console.log('AWS_REGION:', process.env.AWS_REGION || 'us-east-1');
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME || '❌ Missing');

// Validate required environment variables
const requiredEnvVars = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('📝 Please set these environment variables in your Render dashboard:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('🔗 Go to: https://dashboard.render.com → Your Service → Environment');
  process.exit(1);
}

console.log('✅ All S3 environment variables are set');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

// Test S3 connection
s3.headBucket({ Bucket: process.env.S3_BUCKET_NAME }, (err, data) => {
  if (err) {
    console.error('❌ S3 bucket connection failed:', err.message);
    if (err.code === 'NoSuchBucket') {
      console.error('💡 Make sure your bucket name is correct and the bucket exists');
    } else if (err.code === 'Forbidden') {
      console.error('💡 Check your AWS credentials and bucket permissions');
    }
  } else {
    console.log('✅ S3 bucket connection successful');
  }
});

// Configure multer for S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `forklifts/${uniqueSuffix}${extension}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read' // Make uploaded files publicly readable
  }),
  fileFilter: function (req, file, cb) {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to delete file from S3
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract key from URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash
    
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };
    
    await s3.deleteObject(deleteParams).promise();
    console.log('File deleted from S3:', key);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
  }
};

module.exports = {
  upload,
  deleteFromS3,
  s3
};