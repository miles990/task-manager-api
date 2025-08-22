/**
 * Task Routes
 * Defines all API endpoints for task operations
 */

const { Router } = require('express');
const taskService = require('../services/taskService.js');
const { asyncHandler } = require('../middleware/errorHandler.js');
const { validateRequest } = require('../middleware/validation.js');
const { ListTasksSchema, CreateTaskSchema, UpdateTaskSchema } = require('../core/schemas/taskSchemas.js');

const router = Router();

/**
 * GET /tasks
 * Get all tasks with optional filters
 */
router.get(
  '/',
  validateRequest(ListTasksSchema, 'query'),
  asyncHandler(async (req, res) => {
    const tasks = await taskService.getAllTasks(req.query);
    res.json({
      success: true,
      data: tasks,
      count: tasks.length,
      filters: req.query
    });
  })
);

/**
 * GET /tasks/stats
 * Get task statistics
 */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const stats = await taskService.getStatistics();
    res.json({
      success: true,
      data: stats,
    });
  })
);

/**
 * POST /tasks/batch
 * Create multiple tasks
 */
router.post(
  '/batch',
  asyncHandler(async (req, res) => {
    const result = await taskService.batchCreateTasks(req.body.tasks);
    res.status(result.success ? 201 : 207).json({
      success: result.success,
      data: result,
      message: `Created ${result.created.length} tasks`
    });
  })
);

/**
 * POST /tasks/archive
 * Archive old completed tasks
 */
router.post(
  '/archive',
  asyncHandler(async (req, res) => {
    const days = req.body.days || 30;
    const result = await taskService.archiveOldTasks(days);
    res.json({
      success: true,
      data: result
    });
  })
);

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await taskService.getTask(req.params.id);
    res.json({
      success: true,
      data: task,
    });
  })
);

/**
 * POST /tasks
 * Create a new task
 */
router.post(
  '/',
  validateRequest(CreateTaskSchema, 'body'),
  asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body);
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  })
);

/**
 * PATCH /tasks/:id
 * Update a task
 */
router.patch(
  '/:id',
  validateRequest(UpdateTaskSchema, 'body'),
  asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  })
);

/**
 * PUT /tasks/:id
 * Replace a task (full update)
 */
router.put(
  '/:id',
  validateRequest(CreateTaskSchema, 'body'),
  asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json({
      success: true,
      data: task,
      message: 'Task replaced successfully',
    });
  })
);

/**
 * DELETE /tasks/:id
 * Delete a task
 */
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await taskService.deleteTask(req.params.id);
    res.json({
      success: true,
      data: result,
      message: 'Task deleted successfully',
    });
  })
);

module.exports = router;