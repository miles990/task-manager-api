/**
 * Custom Application Error Class
 * Provides consistent error handling across the application
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON format
   * @returns {Object} Error object
   */
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
        timestamp: this.timestamp
      }
    };
  }

  /**
   * Create validation error
   * @param {Array} errors - Validation errors
   * @returns {AppError} Validation error
   */
  static validationError(errors) {
    return new AppError(
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      errors
    );
  }

  /**
   * Create not found error
   * @param {string} resource - Resource name
   * @param {string} id - Resource ID
   * @returns {AppError} Not found error
   */
  static notFound(resource, id) {
    return new AppError(
      `${resource} with id ${id} not found`,
      404,
      'NOT_FOUND'
    );
  }

  /**
   * Create unauthorized error
   * @param {string} message - Error message
   * @returns {AppError} Unauthorized error
   */
  static unauthorized(message = 'Unauthorized access') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  /**
   * Create forbidden error
   * @param {string} message - Error message
   * @returns {AppError} Forbidden error
   */
  static forbidden(message = 'Access forbidden') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  /**
   * Create conflict error
   * @param {string} message - Error message
   * @returns {AppError} Conflict error
   */
  static conflict(message) {
    return new AppError(message, 409, 'CONFLICT');
  }

  /**
   * Create rate limit error
   * @returns {AppError} Rate limit error
   */
  static tooManyRequests() {
    return new AppError(
      'Too many requests, please try again later',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }

  /**
   * Create database error
   * @param {Error} error - Original error
   * @returns {AppError} Database error
   */
  static databaseError(error) {
    return new AppError(
      'Database operation failed',
      500,
      'DATABASE_ERROR',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}

module.exports = AppError;