/**
 * Query utilities for pagination, sorting, and filtering
 */

/**
 * Get pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} - Pagination info
 */
const getPagination = (page = 1, limit = 12) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12)); // Max 50 items per page
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    limitNum,
    skip,
  };
};

/**
 * Build sort object from query parameters
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {object} - MongoDB sort object
 */
const buildSortObject = (sortBy = "createdAt", sortOrder = "desc") => {
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "price",
    "model",
    "brand",
    "type",
    "featured",
    "status",
    "viewCount",
    "sku",
  ];

  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder.toLowerCase() === "asc" ? 1 : -1;

  const sortObject = { [sortField]: order };

  // Secondary sort by createdAt for consistency
  if (sortField !== "createdAt") {
    sortObject.createdAt = -1;
  }

  return sortObject;
};

/**
 * Build filter object from query parameters
 * @param {object} query - Query parameters
 * @returns {object} - MongoDB filter object
 */
const buildFilterObject = (query) => {
  const filters = { isActive: true };

  // Text search
  if (query.search) {
    const searchRegex = new RegExp(
      query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    filters.$or = [
      { model: searchRegex },
      { brand: searchRegex },
      { sku: searchRegex },
      { description: searchRegex },
    ];
  }

  // Brand filter
  if (query.brand && query.brand !== "all") {
    filters.brand = query.brand;
  }

  // Type filter
  if (query.type && query.type !== "all") {
    filters.type = query.type;
  }

  // Status filter
  if (query.status && query.status !== "all") {
    filters.status = query.status;
  }

  // Featured filter
  if (query.featured !== undefined) {
    filters.featured = query.featured === "true";
  }

  // Price range filter
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) {
      const minPrice = parseFloat(query.minPrice);
      if (!isNaN(minPrice)) filters.price.$gte = minPrice;
    }
    if (query.maxPrice) {
      const maxPrice = parseFloat(query.maxPrice);
      if (!isNaN(maxPrice)) filters.price.$lte = maxPrice;
    }
  }

  return filters;
};

/**
 * Generate aggregation pipeline for advanced queries
 * @param {object} options - Aggregation options
 * @returns {array} - MongoDB aggregation pipeline
 */
const buildAggregationPipeline = (options = {}) => {
  const pipeline = [];

  // Match stage (filtering)
  if (options.match) {
    pipeline.push({ $match: options.match });
  }

  // Lookup stage (joins)
  if (options.lookup) {
    pipeline.push({ $lookup: options.lookup });
  }

  // Sort stage
  if (options.sort) {
    pipeline.push({ $sort: options.sort });
  }

  // Pagination
  if (options.skip) {
    pipeline.push({ $skip: options.skip });
  }

  if (options.limit) {
    pipeline.push({ $limit: options.limit });
  }

  // Projection (select fields)
  if (options.project) {
    pipeline.push({ $project: options.project });
  }

  return pipeline;
};

module.exports = {
  getPagination,
  buildSortObject,
  buildFilterObject,
  buildAggregationPipeline,
};

// =================================================================
// middleware/errorHandler.js

/**
 * Error handling middleware for the application
 */

/**
 * Development error response
 * @param {Error} err - Error object
 * @param {Response} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Production error response
 * @param {Error} err - Error object
 * @param {Response} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥", err);

    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

/**
 * Handle MongoDB cast errors
 * @param {Error} err - MongoDB cast error
 * @returns {Error} - Formatted error
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return createError(message, 400);
};

/**
 * Handle MongoDB duplicate field errors
 * @param {Error} err - MongoDB duplicate error
 * @returns {Error} - Formatted error
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use another value.`;
  return createError(message, 400);
};

/**
 * Handle MongoDB validation errors
 * @param {Error} err - MongoDB validation error
 * @returns {Error} - Formatted error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return createError(message, 400);
};

/**
 * Handle JWT errors
 * @returns {Error} - Formatted error
 */
const handleJWTError = () =>
  createError("Invalid token. Please log in again!", 401);

/**
 * Handle JWT expired errors
 * @returns {Error} - Formatted error
 */
const handleJWTExpiredError = () =>
  createError("Your token has expired! Please log in again.", 401);

/**
 * Create error object with message and status code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} - Error object
 */
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

/**
 * Main error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // MongoDB cast error
    if (err.name === "CastError") error = handleCastErrorDB(error);

    // MongoDB duplicate field error
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);

    // MongoDB validation error
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);

    // JWT error
    if (err.name === "JsonWebTokenError") error = handleJWTError();

    // JWT expired error
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

/**
 * Catch async errors wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Handle 404 errors for undefined routes
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const handleNotFound = (req, res, next) => {
  const err = createError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

module.exports = {
  errorHandler,
  catchAsync,
  handleNotFound,
  createError,
};
