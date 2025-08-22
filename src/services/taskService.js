/**
 * Task Service
 * Business logic layer for task operations
 * Now uses TaskRepository for data persistence
 */

const { CreateTaskSchema, UpdateTaskSchema } = require('../models/task.js');
const TaskRepository = require('../core/repositories/taskRepository.js');
const AppError = require('../core/errors/AppError.js');

class TaskService {
  constructor() {
    this.repository = new TaskRepository();
  }

  /**
   * Create a new task
   * @param {Object} data - Task data
   * @returns {Promise<Object>} Created task
   */
  async createTask(data) {
    try {
      const validated = CreateTaskSchema.parse(data);
      return await this.repository.create(validated);
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
      }
      throw error;
    }
  }

  /**
   * Get a single task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  async getTask(id) {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new AppError(`Task with id ${id} not found`, 404, 'TASK_NOT_FOUND');
    }
    return task;
  }

  /**
   * Get all tasks with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Array of tasks
   */
  async getAllTasks(filters = {}) {
    // Additional filtering for search
    let tasks = await this.repository.findAll(filters);
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }
    
    return tasks;
  }

  /**
   * Update a task
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(id, updates) {
    try {
      const validated = UpdateTaskSchema.parse(updates);
      const task = await this.repository.update(id, validated);
      
      if (!task) {
        throw new AppError(`Task with id ${id} not found`, 404, 'TASK_NOT_FOUND');
      }
      
      return task;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
      }
      throw error;
    }
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Success message
   */
  async deleteTask(id) {
    const deleted = await this.repository.delete(id);
    
    if (!deleted) {
      throw new AppError(`Task with id ${id} not found`, 404, 'TASK_NOT_FOUND');
    }
    
    return { message: 'Task deleted successfully', id };
  }

  /**
   * Get task statistics
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics() {
    return await this.repository.getStats();
  }

  /**
   * Batch create tasks
   * @param {Array} tasksData - Array of task data
   * @returns {Promise<Array>} Created tasks
   */
  async batchCreateTasks(tasksData) {
    const tasks = [];
    const errors = [];
    
    for (let i = 0; i < tasksData.length; i++) {
      try {
        const task = await this.createTask(tasksData[i]);
        tasks.push(task);
      } catch (error) {
        errors.push({
          index: i,
          error: error.message
        });
      }
    }
    
    return {
      created: tasks,
      errors: errors,
      success: errors.length === 0
    };
  }

  /**
   * Archive completed tasks older than specified days
   * @param {number} days - Number of days
   * @returns {Promise<Object>} Archive result
   */
  async archiveOldTasks(days = 30) {
    const tasks = await this.repository.findAll({ status: 'completed' });
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    let archivedCount = 0;
    
    for (const task of tasks) {
      const updatedDate = new Date(task.updatedAt);
      if (updatedDate < cutoffDate) {
        await this.repository.update(task.id, { status: 'archived' });
        archivedCount++;
      }
    }
    
    return {
      archivedCount,
      message: `Archived ${archivedCount} tasks older than ${days} days`
    };
  }
}

// Export singleton instance
module.exports = new TaskService();