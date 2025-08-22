import { Task, CreateTaskSchema, UpdateTaskSchema } from '../models/task.js';

class TaskService {
  constructor() {
    this.tasks = new Map();
  }

  createTask(data) {
    const validated = CreateTaskSchema.parse(data);
    const task = new Task(validated);
    this.tasks.set(task.id, task);
    return task;
  }

  getTask(id) {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }

  getAllTasks(filters = {}) {
    let tasks = Array.from(this.tasks.values());

    if (filters.status) {
      tasks = tasks.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      tasks = tasks.filter((task) => task.priority === filters.priority);
    }

    if (filters.assignee) {
      tasks = tasks.filter((task) => task.assignee === filters.assignee);
    }

    if (filters.tags && filters.tags.length > 0) {
      tasks = tasks.filter((task) =>
        filters.tags.some((tag) => task.tags.includes(tag))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  updateTask(id, updates) {
    const task = this.getTask(id);
    const validated = UpdateTaskSchema.parse(updates);
    task.update(validated);
    return task;
  }

  deleteTask(id) {
    const task = this.getTask(id);
    this.tasks.delete(id);
    return task;
  }

  getStatistics() {
    const tasks = Array.from(this.tasks.values());
    const stats = {
      total: tasks.length,
      byStatus: {},
      byPriority: {},
      overdue: 0,
    };

    const now = new Date();

    tasks.forEach((task) => {
      stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
      stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;

      if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed') {
        stats.overdue++;
      }
    });

    return stats;
  }
}

export const taskService = new TaskService();