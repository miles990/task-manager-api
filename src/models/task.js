import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(Object.values(TaskStatus)),
  priority: z.enum(Object.values(TaskPriority)),
  tags: z.array(z.string()).default([]),
  assignee: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export class Task {
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

  update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return this;
  }
}