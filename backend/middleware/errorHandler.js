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
    stack: err.stack
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
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
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
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return createError(message, 400);
};

/**
 * Handle JWT errors
 * @returns {Error} - Formatted error
 */
const handleJWTError = () =>
  createError('Invalid token. Please log in again!', 401);

/**
 * Handle JWT expired errors
 * @returns {Error} - Formatted error
 */
const handleJWTExpiredError = () =>
  createError('Your token has expired! Please log in again.', 401);

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
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // MongoDB cast error
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    
    // MongoDB duplicate field error
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    
    // MongoDB validation error
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    
    // JWT error
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    
    // JWT expired error
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

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
  createError
};