/**
 * Database migration manager
 * Handles schema creation and updates
 */

const dbConnection = require('./connection');

class MigrationManager {
  constructor() {
    this.db = dbConnection.getInstance();
  }

  /**
   * Run all migrations
   */
  async runMigrations() {
    console.log('Running database migrations...');
    
    // Create migrations table if not exists
    this.createMigrationsTable();
    
    // Run migrations in order
    const migrations = [
      { version: 1, name: 'create_tasks_table', fn: this.createTasksTable.bind(this) },
      { version: 2, name: 'add_indexes', fn: this.addIndexes.bind(this) }
    ];

    for (const migration of migrations) {
      if (!this.isMigrationApplied(migration.version)) {
        console.log(`Running migration ${migration.version}: ${migration.name}`);
        migration.fn();
        this.recordMigration(migration.version, migration.name);
      }
    }
    
    console.log('Migrations completed successfully');
  }

  /**
   * Create migrations tracking table
   */
  createMigrationsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    this.db.prepare(sql).run();
  }

  /**
   * Check if migration has been applied
   */
  isMigrationApplied(version) {
    const sql = 'SELECT version FROM migrations WHERE version = ?';
    const result = this.db.prepare(sql).get(version);
    return !!result;
  }

  /**
   * Record applied migration
   */
  recordMigration(version, name) {
    const sql = 'INSERT INTO migrations (version, name) VALUES (?, ?)';
    this.db.prepare(sql).run(version, name);
  }

  /**
   * Migration 1: Create tasks table
   */
  createTasksTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        assignee TEXT,
        due_date TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
        CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
      )
    `;
    this.db.prepare(sql).run();

    // Create trigger to update updated_at
    const triggerSql = `
      CREATE TRIGGER IF NOT EXISTS update_tasks_updated_at
      AFTER UPDATE ON tasks
      BEGIN
        UPDATE tasks SET updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
      END
    `;
    this.db.prepare(triggerSql).run();
  }

  /**
   * Migration 2: Add indexes for performance
   */
  addIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)',
      'CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)',
      'CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee)',
      'CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)'
    ];

    for (const sql of indexes) {
      this.db.prepare(sql).run();
    }
  }

  /**
   * Reset database (for testing purposes)
   */
  resetDatabase() {
    console.log('Resetting database...');
    this.db.prepare('DROP TABLE IF EXISTS tasks').run();
    this.db.prepare('DROP TABLE IF EXISTS migrations').run();
    this.runMigrations();
  }
}

module.exports = new MigrationManager();