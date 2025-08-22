/**
 * Configuration management for the Task Manager API
 * Centralizes all environment variables and configuration settings
 */

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    path: process.env.DATABASE_PATH || './data/tasks.db',
    verbose: process.env.DATABASE_VERBOSE === 'true'
  },
  
  // API configuration
  api: {
    version: '1.0.0',
    basePath: '/api/v1',
    maxRequestSize: '10mb',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  
  // MCP Server configuration
  mcp: {
    enabled: process.env.MCP_ENABLED !== 'false',
    stdio: process.env.MCP_STDIO === 'true'
  },
  
  // Development settings
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
};

module.exports = config;