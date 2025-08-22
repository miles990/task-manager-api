/**
 * Task Repository
 * Handles all database operations for tasks
 */

const dbConnection = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class TaskRepository {
  constructor() {
    this.db = dbConnection.getInstance();
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Object} Created task
   */
  async create(taskData) {
    const id = taskData.id || uuidv4();
    const tags = Array.isArray(taskData.tags) ? JSON.stringify(taskData.tags) : null;
    
    const sql = `
      INSERT INTO tasks (id, title, description, status, priority, assignee, due_date, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const stmt = this.db.prepare(sql);
    stmt.run(
      id,
      taskData.title,
      taskData.description || null,
      taskData.status || 'pending',
      taskData.priority || 'medium',
      taskData.assignee || null,
      taskData.dueDate || null,
      tags
    );
    
    return this.findById(id);
  }

  /**
   * Find task by ID
   * @param {string} id - Task ID
   * @returns {Object|null} Task or null if not found
   */
  async findById(id) {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const task = this.db.prepare(sql).get(id);
    
    if (!task) {
      return null;
    }
    
    return this.formatTask(task);
  }

  /**
   * Find all tasks with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Array} Array of tasks
   */
  async findAll(filters = {}) {
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];
    
    // Apply filters
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    
    if (filters.priority) {
      sql += ' AND priority = ?';
      params.push(filters.priority);
    }
    
    if (filters.assignee) {
      sql += ' AND assignee = ?';
      params.push(filters.assignee);
    }
    
    if (filters.tag) {
      sql += ' AND tags LIKE ?';
      params.push(`%"${filters.tag}"%`);
    }
    
    // Add ordering
    sql += ' ORDER BY created_at DESC';
    
    // Apply limit
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }
    
    const tasks = this.db.prepare(sql).all(...params);
    return tasks.map(task => this.formatTask(task));
  }

  /**
   * Update a task
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated task or null if not found
   */
  async update(id, updates) {
    const task = await this.findById(id);
    if (!task) {
      return null;
    }
    
    const fields = [];
    const params = [];
    
    // Build update query dynamically
    if (updates.title !== undefined) {
      fields.push('title = ?');
      params.push(updates.title);
    }
    
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }
    
    if (updates.status !== undefined) {
      fields.push('status = ?');
      params.push(updates.status);
    }
    
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      params.push(updates.priority);
    }
    
    if (updates.assignee !== undefined) {
      fields.push('assignee = ?');
      params.push(updates.assignee);
    }
    
    if (updates.dueDate !== undefined) {
      fields.push('due_date = ?');
      params.push(updates.dueDate);
    }
    
    if (updates.tags !== undefined) {
      fields.push('tags = ?');
      params.push(JSON.stringify(updates.tags));
    }
    
    if (fields.length === 0) {
      return task;
    }
    
    params.push(id);
    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
    
    this.db.prepare(sql).run(...params);
    return this.findById(id);
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {boolean} True if deleted, false if not found
   */
  async delete(id) {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const result = this.db.prepare(sql).run(id);
    return result.changes > 0;
  }

  /**
   * Get task statistics
   * @returns {Object} Statistics object
   */
  async getStats() {
    const totalSql = 'SELECT COUNT(*) as count FROM tasks';
    const statusSql = 'SELECT status, COUNT(*) as count FROM tasks GROUP BY status';
    const prioritySql = 'SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority';
    const overdueSql = `
      SELECT COUNT(*) as count FROM tasks 
      WHERE status != 'completed' AND status != 'archived' 
      AND due_date < datetime('now')
    `;
    
    const total = this.db.prepare(totalSql).get().count;
    const byStatus = this.db.prepare(statusSql).all();
    const byPriority = this.db.prepare(prioritySql).all();
    const overdue = this.db.prepare(overdueSql).get().count;
    
    // Convert arrays to objects
    const statusMap = byStatus.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});
    
    const priorityMap = byPriority.reduce((acc, row) => {
      acc[row.priority] = row.count;
      return acc;
    }, {});
    
    return {
      total,
      byStatus: {
        pending: statusMap.pending || 0,
        in_progress: statusMap.in_progress || 0,
        completed: statusMap.completed || 0,
        archived: statusMap.archived || 0
      },
      byPriority: {
        low: priorityMap.low || 0,
        medium: priorityMap.medium || 0,
        high: priorityMap.high || 0,
        urgent: priorityMap.urgent || 0
      },
      overdue
    };
  }

  /**
   * Format task from database row
   * @param {Object} row - Database row
   * @returns {Object} Formatted task
   */
  formatTask(row) {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      assignee: row.assignee,
      dueDate: row.due_date,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Delete all tasks (for testing)
   */
  async deleteAll() {
    const sql = 'DELETE FROM tasks';
    this.db.prepare(sql).run();
  }
}

module.exports = TaskRepository;