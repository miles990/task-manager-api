/**
 * Request Logger Middleware
 * Logs all incoming requests with detailed information
 */

const config = require('../config');

/**
 * Request logger middleware
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;
  
  // Generate request ID for tracking
  req.id = generateRequestId();
  
  // Log request details
  if (config.isDevelopment) {
    console.log(`[${req.id}] → ${method} ${url} from ${ip}`);
  }
  
  // Capture response details
  const originalSend = res.send;
  res.send = function(data) {
    res.responseBody = data;
    originalSend.call(this, data);
  };
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const level = getLogLevel(statusCode);
    const emoji = getStatusEmoji(statusCode);
    
    const logMessage = formatLogMessage({
      id: req.id,
      timestamp: new Date().toISOString(),
      level,
      method,
      url,
      statusCode,
      duration,
      ip,
      userAgent: headers['user-agent'] || 'Unknown',
      emoji
    });
    
    if (level === 'ERROR') {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`[${req.id}] ⚠️  Slow request detected: ${duration}ms`);
    }
  });
  
  next();
};

/**
 * Generate unique request ID
 * @returns {string} Request ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get log level based on status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Log level
 */
function getLogLevel(statusCode) {
  if (statusCode >= 500) return 'ERROR';
  if (statusCode >= 400) return 'WARN';
  if (statusCode >= 300) return 'INFO';
  return 'INFO';
}

/**
 * Get emoji for status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Emoji
 */
function getStatusEmoji(statusCode) {
  if (statusCode >= 500) return '💥';
  if (statusCode >= 400) return '⚠️';
  if (statusCode >= 300) return '↪️';
  if (statusCode >= 200) return '✅';
  return '📝';
}

/**
 * Format log message
 * @param {Object} details - Log details
 * @returns {string} Formatted message
 */
function formatLogMessage(details) {
  if (config.logging.format === 'json') {
    return JSON.stringify({
      requestId: details.id,
      timestamp: details.timestamp,
      level: details.level,
      method: details.method,
      url: details.url,
      statusCode: details.statusCode,
      duration: details.duration,
      ip: details.ip,
      userAgent: details.userAgent
    });
  }
  
  // Human-readable format
  return `[${details.id}] ${details.emoji} ${details.method} ${details.url} ${details.statusCode} ${details.duration}ms - ${details.ip}`;
}

/**
 * Performance monitoring middleware
 * Tracks request performance metrics
 */
const performanceMonitor = (req, res, next) => {
  req.metrics = {
    startTime: process.hrtime.bigint(),
    startMemory: process.memoryUsage()
  };
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const duration = Number(endTime - req.metrics.startTime) / 1000000; // Convert to ms
    const memoryDelta = endMemory.heapUsed - req.metrics.startMemory.heapUsed;
    
    if (config.isDevelopment && duration > 100) {
      console.log(`[${req.id}] Performance: ${duration.toFixed(2)}ms, Memory: ${(memoryDelta / 1024).toFixed(2)}KB`);
    }
  });
  
  next();
};

module.exports = {
  requestLogger,
  performanceMonitor
};