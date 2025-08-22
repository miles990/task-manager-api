/**
 * Task Model
 * Defines the Task class and exports schemas from centralized location
 */

const { v4: uuidv4 } = require('uuid');

// Re-export schemas from centralized location
const {
  TaskSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  TASK_STATUS,
  TASK_PRIORITY
} = require('../core/schemas/taskSchemas.js');

// Export constants for backward compatibility
const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

/**
 * Task class for creating task instances
 */
class Task {
  constructor(data) {
    const now = new Date().toISOString();
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || TaskStatus.PENDING;
    this.priority = data.priority || TaskPriority.MEDIUM;
    this.tags = data.tags || [];
    this.assignee = data.assignee || null;
    this.dueDate = data.dueDate || null;
    this.createdAt = data.createdAt || now;
    this.updatedAt = data.updatedAt || now;
  }

  /**
   * Convert task to JSON
   * @returns {Object} Task as plain object
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      tags: this.tags,
      assignee: this.assignee,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Update task properties
   * @param {Object} updates - Properties to update
   * @returns {Task} Updated task instance
   */
  update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Check if task is overdue
   * @returns {boolean} True if task is overdue
   */
  isOverdue() {
    if (!this.dueDate || this.status === 'completed' || this.status === 'archived') {
      return false;
    }
    return new Date(this.dueDate) < new Date();
  }

  /**
   * Calculate task age in days
   * @returns {number} Age in days
   */
  getAgeInDays() {
    const created = new Date(this.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Export everything
module.exports = {
  Task,
  TaskStatus,
  TaskPriority,
  TaskSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  TASK_STATUS,
  TASK_PRIORITY
};