import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Task, TaskStatus, TaskPriority } from '../src/models/task.js';
import { taskService } from '../src/services/taskService.js';

describe('Task Model', () => {
  it('should create a task with default values', () => {
    const task = new Task({ title: 'Test Task' });
    assert.strictEqual(task.title, 'Test Task');
    assert.strictEqual(task.status, TaskStatus.PENDING);
    assert.strictEqual(task.priority, TaskPriority.MEDIUM);
    assert.ok(task.id);
    assert.ok(task.createdAt);
  });

  it('should update task properties', () => {
    const task = new Task({ title: 'Test Task' });
    const originalUpdatedAt = task.updatedAt;
    
    setTimeout(() => {
      task.update({ title: 'Updated Task', status: TaskStatus.COMPLETED });
      assert.strictEqual(task.title, 'Updated Task');
      assert.strictEqual(task.status, TaskStatus.COMPLETED);
      assert.notStrictEqual(task.updatedAt, originalUpdatedAt);
    }, 10);
  });
});

describe('Task Service', () => {
  it('should create and retrieve a task', () => {
    const taskData = {
      title: 'Service Test Task',
      description: 'Testing task service',
      priority: TaskPriority.HIGH,
    };
    
    const created = taskService.createTask(taskData);
    assert.ok(created.id);
    
    const retrieved = taskService.getTask(created.id);
    assert.strictEqual(retrieved.title, taskData.title);
    assert.strictEqual(retrieved.priority, TaskPriority.HIGH);
  });

  it('should filter tasks by status', () => {
    taskService.tasks.clear();
    
    taskService.createTask({ title: 'Task 1', status: TaskStatus.PENDING });
    taskService.createTask({ title: 'Task 2', status: TaskStatus.COMPLETED });
    taskService.createTask({ title: 'Task 3', status: TaskStatus.PENDING });
    
    const pendingTasks = taskService.getAllTasks({ status: TaskStatus.PENDING });
    assert.strictEqual(pendingTasks.length, 2);
  });

  it('should search tasks by title', () => {
    taskService.tasks.clear();
    
    taskService.createTask({ title: 'Deploy to production' });
    taskService.createTask({ title: 'Fix bug in login' });
    taskService.createTask({ title: 'Update documentation' });
    
    const searchResults = taskService.getAllTasks({ search: 'bug' });
    assert.strictEqual(searchResults.length, 1);
    assert.strictEqual(searchResults[0].title, 'Fix bug in login');
  });

  it('should get task statistics', () => {
    taskService.tasks.clear();
    
    taskService.createTask({ title: 'Task 1', status: TaskStatus.PENDING, priority: TaskPriority.HIGH });
    taskService.createTask({ title: 'Task 2', status: TaskStatus.COMPLETED, priority: TaskPriority.LOW });
    taskService.createTask({ title: 'Task 3', status: TaskStatus.PENDING, priority: TaskPriority.HIGH });
    
    const stats = taskService.getStatistics();
    assert.strictEqual(stats.total, 3);
    assert.strictEqual(stats.byStatus[TaskStatus.PENDING], 2);
    assert.strictEqual(stats.byStatus[TaskStatus.COMPLETED], 1);
    assert.strictEqual(stats.byPriority[TaskPriority.HIGH], 2);
  });

  it('should throw error for non-existent task', () => {
    assert.throws(
      () => taskService.getTask('non-existent-id'),
      /not found/
    );
  });
});