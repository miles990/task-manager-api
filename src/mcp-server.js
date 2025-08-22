#!/usr/bin/env node

/**
 * Task Manager MCP Server
 * Provides Model Context Protocol interface for task management
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import { taskService } from './services/taskService.js';
import { z } from 'zod';

// Create MCP server instance
const server = new Server(
  {
    name: 'task-manager-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define schemas for validation
const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'archived']).default('pending').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
});

const UpdateTaskSchema = z.object({
  id: z.string().uuid('Invalid task ID'),
  updates: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed', 'archived']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    tags: z.array(z.string()).optional(),
    dueDate: z.string().optional(),
    assignee: z.string().optional(),
  }),
});

const ListTasksSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignee: z.string().optional(),
  tag: z.string().optional(),
  limit: z.number().int().positive().optional(),
});

const DeleteTaskSchema = z.object({
  id: z.string().uuid('Invalid task ID'),
});

const GetTaskSchema = z.object({
  id: z.string().uuid('Invalid task ID'),
});

// Handle ListToolsRequest - List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_task',
      description: 'Create a new task with title, description, priority, and other optional fields',
      inputSchema: {
        type: 'object',
        properties: {
          title: { 
            type: 'string',
            description: 'The title of the task (required)'
          },
          description: { 
            type: 'string',
            description: 'Detailed description of the task'
          },
          priority: { 
            type: 'string',
            enum: ['low', 'medium', 'high', 'urgent'],
            description: 'Task priority level (default: medium)'
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags for categorizing the task'
          },
          dueDate: {
            type: 'string',
            description: 'Due date in ISO format'
          },
          assignee: {
            type: 'string',
            description: 'Person assigned to the task'
          }
        },
        required: ['title'],
      },
    },
    {
      name: 'list_tasks',
      description: 'List all tasks with optional filters for status, priority, assignee, or tag',
      inputSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'completed', 'archived'],
            description: 'Filter by task status'
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'urgent'],
            description: 'Filter by priority level'
          },
          assignee: {
            type: 'string',
            description: 'Filter by assignee'
          },
          tag: {
            type: 'string',
            description: 'Filter by tag'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of tasks to return'
          }
        },
      },
    },
    {
      name: 'get_task',
      description: 'Get details of a specific task by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The UUID of the task'
          }
        },
        required: ['id'],
      },
    },
    {
      name: 'update_task',
      description: 'Update an existing task with new values',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The UUID of the task to update'
          },
          updates: {
            type: 'object',
            description: 'Object containing fields to update',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              status: {
                type: 'string',
                enum: ['pending', 'in_progress', 'completed', 'archived']
              },
              priority: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'urgent']
              },
              tags: {
                type: 'array',
                items: { type: 'string' }
              },
              dueDate: { type: 'string' },
              assignee: { type: 'string' }
            }
          }
        },
        required: ['id', 'updates'],
      },
    },
    {
      name: 'delete_task',
      description: 'Delete a task by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The UUID of the task to delete'
          }
        },
        required: ['id'],
      },
    },
    {
      name: 'get_task_stats',
      description: 'Get statistics about all tasks',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ],
}));

// Handle CallToolRequest - Execute tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_task': {
        const validated = CreateTaskSchema.parse(args);
        const task = taskService.createTask(validated);
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Task created successfully!\n\nID: ${task.id}\nTitle: ${task.title}\nPriority: ${task.priority}\nStatus: ${task.status}\n\nYou can now update, list, or manage this task using its ID.`,
            },
          ],
        };
      }

      case 'list_tasks': {
        const validated = ListTasksSchema.parse(args || {});
        const tasks = taskService.getAllTasks(validated);
        
        if (tasks.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No tasks found matching the specified criteria.',
              },
            ],
          };
        }

        const taskList = tasks.map((task, index) => 
          `${index + 1}. [${task.status}] ${task.title} (${task.priority})\n   ID: ${task.id}\n   Created: ${task.createdAt}`
        ).join('\n\n');

        return {
          content: [
            {
              type: 'text',
              text: `Found ${tasks.length} task(s):\n\n${taskList}`,
            },
          ],
        };
      }

      case 'get_task': {
        const validated = GetTaskSchema.parse(args);
        const task = taskService.getTask(validated.id);
        
        if (!task) {
          throw new Error(`Task with ID ${validated.id} not found`);
        }

        const taskDetails = `Task Details:
ID: ${task.id}
Title: ${task.title}
Description: ${task.description || 'No description'}
Status: ${task.status}
Priority: ${task.priority}
Tags: ${task.tags?.join(', ') || 'None'}
Assignee: ${task.assignee || 'Unassigned'}
Due Date: ${task.dueDate || 'No due date'}
Created: ${task.createdAt}
Updated: ${task.updatedAt}`;

        return {
          content: [
            {
              type: 'text',
              text: taskDetails,
            },
          ],
        };
      }

      case 'update_task': {
        const validated = UpdateTaskSchema.parse(args);
        const task = taskService.updateTask(validated.id, validated.updates);
        
        if (!task) {
          throw new Error(`Task with ID ${validated.id} not found`);
        }

        const updatedFields = Object.keys(validated.updates)
          .map(field => `  - ${field}: ${validated.updates[field]}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `✅ Task updated successfully!\n\nID: ${task.id}\nTitle: ${task.title}\n\nUpdated fields:\n${updatedFields}`,
            },
          ],
        };
      }

      case 'delete_task': {
        const validated = DeleteTaskSchema.parse(args);
        const success = taskService.deleteTask(validated.id);
        
        if (!success) {
          throw new Error(`Task with ID ${validated.id} not found`);
        }

        return {
          content: [
            {
              type: 'text',
              text: `✅ Task ${validated.id} deleted successfully!`,
            },
          ],
        };
      }

      case 'get_task_stats': {
        const tasks = taskService.getAllTasks({});
        const stats = {
          total: tasks.length,
          byStatus: {
            pending: tasks.filter(t => t.status === 'pending').length,
            'in_progress': tasks.filter(t => t.status === 'in_progress').length,
            completed: tasks.filter(t => t.status === 'completed').length,
            archived: tasks.filter(t => t.status === 'archived').length,
          },
          byPriority: {
            urgent: tasks.filter(t => t.priority === 'urgent').length,
            high: tasks.filter(t => t.priority === 'high').length,
            medium: tasks.filter(t => t.priority === 'medium').length,
            low: tasks.filter(t => t.priority === 'low').length,
          },
        };

        const statsText = `📊 Task Statistics:

Total Tasks: ${stats.total}

By Status:
  • Pending: ${stats.byStatus.pending}
  • In Progress: ${stats.byStatus.in_progress}
  • Completed: ${stats.byStatus.completed}
  • Archived: ${stats.byStatus.archived}

By Priority:
  • Urgent: ${stats.byPriority.urgent}
  • High: ${stats.byPriority.high}
  • Medium: ${stats.byPriority.medium}
  • Low: ${stats.byPriority.low}

Completion Rate: ${stats.total > 0 ? ((stats.byStatus.completed / stats.total) * 100).toFixed(1) : 0}%`;

        return {
          content: [
            {
              type: 'text',
              text: statsText,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `❌ Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the MCP server
async function startMCPServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr to avoid interfering with stdio transport
  console.error('🚀 Task Manager MCP Server started');
  console.error('📝 Available tools: create_task, list_tasks, get_task, update_task, delete_task, get_task_stats');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('\n👋 Shutting down Task Manager MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('\n👋 Shutting down Task Manager MCP Server...');
  process.exit(0);
});

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startMCPServer().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}

export { server, startMCPServer };