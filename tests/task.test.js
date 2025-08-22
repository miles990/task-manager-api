const { describe, it } = require('node:test');
const assert = require('node:assert');
const taskService = require('../src/services/taskService.js');

describe('Task Service', () => {
  it('should create and retrieve a task', async () => {
    const taskData = {
      title: 'Service Test Task',
      description: 'Testing task service',
      priority: 'high',
    };
    
    const created = await taskService.createTask(taskData);
    assert.ok(created.id);
    
    const retrieved = await taskService.getTask(created.id);
    assert.strictEqual(retrieved.title, taskData.title);
    assert.strictEqual(retrieved.priority, 'high');
  });

  it('should filter tasks by status', async () => {
    // Clear existing tasks from database
    const allTasks = await taskService.getAllTasks();
    for (const task of allTasks) {
      try {
        await taskService.deleteTask(task.id);
      } catch (e) {
        // Ignore errors
      }
    }
    
    await taskService.createTask({ title: 'Task 1', status: 'pending' });
    await taskService.createTask({ title: 'Task 2', status: 'completed' });
    await taskService.createTask({ title: 'Task 3', status: 'pending' });
    
    const pendingTasks = await taskService.getAllTasks({ status: 'pending' });
    assert.strictEqual(pendingTasks.length, 2);
    
    const completedTasks = await taskService.getAllTasks({ status: 'completed' });
    assert.strictEqual(completedTasks.length, 1);
  });

  it('should update a task', async () => {
    const task = await taskService.createTask({ title: 'Update Test' });
    const updated = await taskService.updateTask(task.id, {
      title: 'Updated Title',
      status: 'in_progress',
    });
    
    assert.strictEqual(updated.title, 'Updated Title');
    assert.strictEqual(updated.status, 'in_progress');
  });

  it('should delete a task', async () => {
    const task = await taskService.createTask({ title: 'Delete Test' });
    const taskId = task.id;
    
    const result = await taskService.deleteTask(taskId);
    assert.ok(result.message);
    
    await assert.rejects(async () => {
      await taskService.getTask(taskId);
    }, {
      message: /not found/,
    });
  });

  it('should get task statistics', async () => {
    // Clear existing tasks
    const allTasks = await taskService.getAllTasks();
    for (const task of allTasks) {
      try {
        await taskService.deleteTask(task.id);
      } catch (e) {
        // Ignore errors
      }
    }
    
    await taskService.createTask({ title: 'Stat 1', status: 'pending', priority: 'high' });
    await taskService.createTask({ title: 'Stat 2', status: 'completed', priority: 'low' });
    await taskService.createTask({ title: 'Stat 3', status: 'in_progress', priority: 'high' });
    
    const stats = await taskService.getStatistics();
    
    assert.strictEqual(stats.total, 3);
    assert.strictEqual(stats.byStatus.pending, 1);
    assert.strictEqual(stats.byStatus.completed, 1);
    assert.strictEqual(stats.byStatus.in_progress, 1);
    assert.strictEqual(stats.byPriority.high, 2);
    assert.strictEqual(stats.byPriority.low, 1);
  });

  it('should handle batch operations', async () => {
    const tasks = [
      { title: 'Batch 1', priority: 'low' },
      { title: 'Batch 2', priority: 'high' },
      { title: 'Batch 3', priority: 'medium' },
    ];
    
    const result = await taskService.batchCreateTasks(tasks);
    
    assert.ok(result.created);
    assert.strictEqual(result.created.length, 3);
    assert.ok(result.errors !== undefined);
    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.success);
  });

  it('should validate task creation', async () => {
    await assert.rejects(async () => {
      await taskService.createTask({ title: '' });
    }, {
      message: /Validation failed/,
    });
    
    await assert.rejects(async () => {
      await taskService.createTask({ title: 'Test', priority: 'invalid' });
    }, {
      message: /Validation failed/,
    });
  });

  it('should archive old tasks', async () => {
    // Clear existing tasks
    const allTasks = await taskService.getAllTasks();
    for (const task of allTasks) {
      try {
        await taskService.deleteTask(task.id);
      } catch (e) {
        // Ignore errors
      }
    }
    
    // Create a completed task with old date
    const task = await taskService.createTask({ 
      title: 'Old Task', 
      status: 'completed' 
    });
    
    // Manually update the updatedAt to be old
    const connection = require('../src/core/database/connection.js');
    const db = connection.getDatabase();
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 35);
    
    db.prepare('UPDATE tasks SET updated_at = ? WHERE id = ?').run(
      oldDate.toISOString().replace('T', ' ').split('.')[0],
      task.id
    );
    
    // Archive tasks older than 30 days
    const result = await taskService.archiveOldTasks(30);
    
    assert.strictEqual(result.archived, 1);
    
    // Check task is archived
    const archivedTask = await taskService.getTask(task.id);
    assert.strictEqual(archivedTask.status, 'archived');
  });
});