/**
 * Request Validation Middleware
 * Validates request data using Zod schemas
 */

const AppError = require('../core/errors/AppError');

/**
 * Create validation middleware for request data
 * @param {Object} schema - Zod schema
 * @param {string} source - Data source ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const validated = schema.parse(data);
      
      // Replace original data with validated data
      req[source] = validated;
      
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        return next(AppError.validationError(formattedErrors));
      }
      next(error);
    }
  };
};

/**
 * Validate UUID parameter
 * @param {string} paramName - Parameter name
 * @returns {Function} Express middleware
 */
const validateUUID = (paramName = 'id') => {
  return (req, res, next) => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(uuid)) {
      return next(AppError.validationError([{
        field: paramName,
        message: 'Invalid UUID format',
        code: 'invalid_uuid'
      }]));
    }
    
    next();
  };
};

/**
 * Sanitize request data
 * Removes dangerous characters and HTML tags
 * @returns {Function} Express middleware
 */
const sanitizeRequest = () => {
  return (req, res, next) => {
    const sanitize = (obj) => {
      if (typeof obj === 'string') {
        // Remove HTML tags and dangerous characters
        return obj
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]+>/g, '')
          .trim();
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const key in obj) {
          sanitized[key] = sanitize(obj[key]);
        }
        return sanitized;
      }
      return obj;
    };
    
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    
    next();
  };
};

module.exports = {
  validateRequest,
  validateUUID,
  sanitizeRequest
};