/**
 * Database connection manager using better-sqlite3
 * Provides a singleton connection to the SQLite database
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

class DatabaseConnection {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize database connection
   * Creates database directory if it doesn't exist
   */
  connect() {
    if (this.db) {
      return this.db;
    }

    try {
      // Ensure database directory exists
      const dbPath = path.resolve(config.database.path);
      const dbDir = path.dirname(dbPath);
      
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Create database connection
      this.db = new Database(dbPath, {
        verbose: config.database.verbose ? console.log : null
      });

      // Enable foreign keys
      this.db.pragma('foreign_keys = ON');
      
      // Optimize for performance
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      
      console.log(`Database connected at: ${dbPath}`);
      
      return this.db;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Get database instance
   * @returns {Database} SQLite database instance
   */
  getInstance() {
    if (!this.db) {
      return this.connect();
    }
    return this.db;
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('Database connection closed');
    }
  }
}

// Create singleton instance
const connection = new DatabaseConnection();

// Export both the instance and a helper function
module.exports = connection;
module.exports.getDatabase = () => connection.getInstance();