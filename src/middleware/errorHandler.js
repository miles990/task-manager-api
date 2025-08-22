/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

const { ZodError } = require('zod');
const AppError = require('../core/errors/AppError');
const config = require('../config');

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  if (config.isDevelopment) {
    console.error('Error Details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code
    });
  } else {
    console.error('Error:', err.message);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code
        }))
      }
    });
  }

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: err.timestamp
      }
    });
  }

  // Handle MongoDB/Database errors
  if (err.name === 'MongoError' || err.name === 'SqliteError') {
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: config.isDevelopment ? err.message : 'Database operation failed'
      }
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired'
      }
    });
  }

  // Handle syntax errors (bad JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Invalid JSON in request body'
      }
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: config.isProduction ? 'Something went wrong' : message,
      ...(config.isDevelopment && { stack: err.stack })
    }
  });
};

/**
 * Async handler wrapper for route handlers
 * Catches errors in async functions and passes them to error handler
 * @param {Function} fn - Async function
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found handler
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`
    }
  });
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler
};