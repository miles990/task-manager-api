/**
 * Task Manager API Server
 * Main entry point for the REST API
 */

const express = require('express');
const config = require('./config');
const dbConnection = require('./core/database/connection');
const migrations = require('./core/database/migrations');
const taskRoutes = require('./routes/tasks.js');
const { errorHandler } = require('./middleware/errorHandler.js');
const { requestLogger } = require('./middleware/requestLogger.js');
const { sanitizeRequest } = require('./middleware/validation.js');

// Initialize database
async function initializeDatabase() {
  try {
    dbConnection.connect();
    await migrations.runMigrations();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Create Express app
async function createApp() {
  await initializeDatabase();
  
  const app = express();
  
  // Basic middleware
  app.use(express.json({ limit: config.api.maxRequestSize }));
  app.use(express.urlencoded({ extended: true, limit: config.api.maxRequestSize }));
  app.use(sanitizeRequest());
  app.use(requestLogger);
  
  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.cors.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: config.api.version
    });
  });
  
  // API info endpoint
  app.get('/api', (req, res) => {
    res.json({
      name: 'Task Manager API',
      version: config.api.version,
      description: 'A demonstration of Claude Code best practices',
      endpoints: {
        health: '/health',
        tasks: '/api/tasks',
        stats: '/api/tasks/stats',
        documentation: '/api/docs'
      }
    });
  });
  
  // Mount task routes
  app.use('/api/tasks', taskRoutes);
  
  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.url} not found`
      }
    });
  });
  
  // Error handler (must be last)
  app.use(errorHandler);
  
  return app;
}

// Start server
async function startServer() {
  const app = await createApp();
  
  const server = app.listen(config.port, () => {
    console.log('═══════════════════════════════════════════════════');
    console.log('   Task Manager API - Claude Code Best Practices   ');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📡 Server:     http://localhost:${config.port}`);
    console.log(`🏥 Health:     http://localhost:${config.port}/health`);
    console.log(`📚 API Info:   http://localhost:${config.port}/api`);
    console.log(`📋 Tasks API:  http://localhost:${config.port}/api/tasks`);
    console.log(`📊 Stats:      http://localhost:${config.port}/api/tasks/stats`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`💾 Database:   ${config.database.path}`);
    console.log('═══════════════════════════════════════════════════');
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      dbConnection.close();
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      dbConnection.close();
      process.exit(0);
    });
  });
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

module.exports = { createApp };