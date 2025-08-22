/**
 * Centralized Task Schemas
 * Single source of truth for all task validation schemas
 */

const { z } = require('zod');

// Enums for consistent validation
const TaskStatus = z.enum(['pending', 'in_progress', 'completed', 'archived']);
const TaskPriority = z.enum(['low', 'medium', 'high', 'urgent']);

// Base task schema with all fields
const TaskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  status: TaskStatus.default('pending'),
  priority: TaskPriority.default('medium'),
  assignee: z.string().max(100, 'Assignee name too long').optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string().max(50)).max(10, 'Too many tags').default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Schema for creating a new task
const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Schema for updating a task
const UpdateTaskSchema = TaskSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Schema for listing tasks with filters
const ListTasksSchema = z.object({
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  assignee: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

// Schema for bulk operations
const BulkCreateSchema = z.array(CreateTaskSchema).min(1).max(100);

const BulkUpdateSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  updates: UpdateTaskSchema
});

const BulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100)
});

// Export schemas and types
module.exports = {
  // Schemas
  TaskSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  ListTasksSchema,
  BulkCreateSchema,
  BulkUpdateSchema,
  BulkDeleteSchema,
  
  // Enums
  TaskStatus,
  TaskPriority,
  
  // Constants
  TASK_STATUS: ['pending', 'in_progress', 'completed', 'archived'],
  TASK_PRIORITY: ['low', 'medium', 'high', 'urgent']
};