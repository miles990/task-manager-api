import { Router } from 'express';
import { taskService } from '../services/taskService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tasks = taskService.getAllTasks(req.query);
    res.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  })
);

router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const stats = taskService.getStatistics();
    res.json({
      success: true,
      data: stats,
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = taskService.getTask(req.params.id);
    res.json({
      success: true,
      data: task,
    });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const task = taskService.createTask(req.body);
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = taskService.updateTask(req.params.id, req.body);
    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = taskService.deleteTask(req.params.id);
    res.json({
      success: true,
      data: task,
      message: 'Task deleted successfully',
    });
  })
);

export default router;