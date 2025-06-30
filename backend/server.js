const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const forkliftRoutes = require("./routes/forklifts");
const { errorHandler } = require("./middleware/errorHandler");
const { requestLogger } = require("./middleware/logger");

const app = express();

// Trust proxy for Render deployment
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          process.env.FRONTEND_URL,
          "https://virgilpowerforklifts.netlify.app", // Your actual Netlify URL
          "https://your-custom-domain.com", // If you have a custom domain
        ]
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://192.168.1.101:5173",
          "http://127.0.0.1:5173",
        ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
  });
});

// API routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/forklifts", forkliftRoutes);
app.use("/api/upload", require("./routes/upload")); // Add upload routes

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 404 handler for API routes - FIXED: Removed the problematic "/*" pattern
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  // For API-only backend, we don't serve static files
  // Frontend is served separately by Netlify
  app.get("/", (req, res) => {
    res.json({
      message: "Virgil Power Forklifts API",
      status: "Running",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        auth: "/api/auth",
        forklifts: "/api/forklifts",
      },
    });
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create indexes for better performance
    const { Forklift } = require("./models/Forklift");
    await Forklift.createIndexes();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 SIGTERM received, shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🔄 SIGINT received, shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
