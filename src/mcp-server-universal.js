#!/usr/bin/env node

/**
 * Universal Project Manager MCP Server
 * 通用專案管理 MCP 伺服器 - 支援任何類型的專案管理
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  ListToolsRequestSchema,
  CallToolRequestSchema 
} = require('@modelcontextprotocol/sdk/types.js');
const { z } = require('zod');
const config = require('./config');

// 獲取專案管理器和配置
const projectManager = config.getProjectManager();
const mcpConfig = config.mcp;

// 動態載入服務
let taskService = null;
if (config.hasFeature('taskManagement')) {
  try {
    taskService = require('./services/taskService.js');
  } catch (error) {
    console.error('警告：無法載入 taskService，任務管理功能將被禁用');
  }
}

// 創建 MCP 伺服器實例
const server = new Server(
  {
    name: mcpConfig.serverName || 'universal-project-manager',
    version: config.project.version || '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 通用驗證 Schemas
const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  type: z.string().min(1, 'Project type is required'),
  description: z.string().optional(),
  rootPath: z.string().optional(),
  config: z.object({}).optional()
});

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

const SwitchProjectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required')
});

/**
 * 動態生成可用工具列表
 */
function generateTools() {
  const tools = [];
  const currentProject = projectManager.getCurrentProject();
  const features = currentProject?.features || {};

  // 框架管理工具（始終可用）
  tools.push({
    name: 'get_framework_status',
    description: 'Get current framework and project status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  });

  tools.push({
    name: 'list_projects',
    description: 'List all configured projects',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  });

  tools.push({
    name: 'get_project_info',
    description: 'Get detailed information about current project',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: 'Name of the project (optional, defaults to current project)'
        }
      },
    },
  });

  tools.push({
    name: 'switch_project',
    description: 'Switch to a different project',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: 'Name of the project to switch to'
        }
      },
      required: ['projectName'],
    },
  });

  tools.push({
    name: 'add_project',
    description: 'Add a new project to the framework',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        type: { type: 'string', description: 'Project type (node-api, react-app, python-api, go-api)' },
        description: { type: 'string', description: 'Project description' },
        rootPath: { type: 'string', description: 'Project root path' },
        config: { type: 'object', description: 'Project configuration' }
      },
      required: ['name', 'type'],
    },
  });

  // 任務管理工具（僅當功能啟用且服務可用時）
  if (features.taskManagement && taskService) {
    tools.push({
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
    });

    tools.push({
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
    });

    tools.push({
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
    });

    tools.push({
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
    });

    tools.push({
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
    });

    tools.push({
      name: 'get_task_stats',
      description: 'Get statistics about all tasks',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });
  }

  return tools;
}

// Handle ListToolsRequest - 動態生成工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: generateTools()
}));

// Handle CallToolRequest - 執行工具
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // 框架管理工具
      case 'get_framework_status': {
        const status = config.getFrameworkStatus();
        const currentProject = projectManager.getCurrentProject();
        
        const statusText = `🏗️ Universal Project Manager Status:

Framework: ${status.framework.name} v${status.framework.version}
Total Projects: ${status.projectCount}
Active Projects: ${status.activeProjects}
Current Project: ${currentProject?.name || 'None'}
Project Type: ${currentProject?.type || 'N/A'}
MCP Enabled: ${status.mcpEnabled ? '✅' : '❌'}

Current Project Features:
${currentProject?.features ? Object.entries(currentProject.features)
  .map(([key, value]) => `  • ${key}: ${value ? '✅' : '❌'}`)
  .join('\n') : '  No features configured'}

Global Settings:
  • Auto Setup: ${status.globalSettings.autoSetup ? '✅' : '❌'}
  • Enable MCP: ${status.globalSettings.enableMCP ? '✅' : '❌'}
  • Default Database: ${status.globalSettings.defaultDatabase || 'Not set'}`;

        return {
          content: [{ type: 'text', text: statusText }],
        };
      }

      case 'list_projects': {
        const projects = projectManager.getAllProjects();
        const projectList = Object.entries(projects)
          .map(([name, project], index) => 
            `${index + 1}. **${name}** (${project.type})\n   📁 ${project.rootPath}\n   📝 ${project.description || 'No description'}\n   🎯 Features: ${Object.keys(project.features || {}).join(', ') || 'None'}`
          )
          .join('\n\n');

        return {
          content: [
            {
              type: 'text',
              text: projectList || '沒有配置任何專案。使用 add_project 工具添加第一個專案。',
            },
          ],
        };
      }

      case 'get_project_info': {
        const projectName = args?.projectName || projectManager.getCurrentProject()?.name;
        if (!projectName) {
          throw new Error('沒有指定專案名稱且沒有當前專案');
        }

        const project = projectManager.getProject(projectName);
        if (!project) {
          throw new Error(`專案不存在: ${projectName}`);
        }

        const validation = projectManager.validateProject(projectName);
        const projectInfo = `📋 Project Information: ${project.name}

Type: ${project.type}
Description: ${project.description || 'No description'}
Root Path: ${project.rootPath}

Configuration:
${JSON.stringify(project.config, null, 2)}

Features:
${Object.entries(project.features || {})
  .map(([key, value]) => `  • ${key}: ${value ? '✅' : '❌'}`)
  .join('\n')}

Scripts:
${Object.entries(project.scripts || {})
  .map(([key, value]) => `  • ${key}: ${value}`)
  .join('\n')}

Validation Status: ${validation.valid ? '✅ Valid' : '❌ Invalid'}
${validation.errors.length > 0 ? `\nErrors:\n${validation.errors.map(e => `  • ${e}`).join('\n')}` : ''}`;

        return {
          content: [{ type: 'text', text: projectInfo }],
        };
      }

      case 'switch_project': {
        const validated = SwitchProjectSchema.parse(args);
        projectManager.setDefaultProject(validated.projectName);
        config.reload(); // 重新載入配置

        return {
          content: [
            {
              type: 'text',
              text: `✅ 成功切換到專案: ${validated.projectName}\n\n🔄 配置已重新載入，新的 MCP 工具現在可用。`,
            },
          ],
        };
      }

      case 'add_project': {
        const validated = ProjectSchema.parse(args);
        const project = projectManager.addProject(validated.name, validated);
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ 專案創建成功!\n\n名稱: ${project.name}\n類型: ${project.type}\n路徑: ${project.rootPath}\n\n使用 switch_project 切換到此專案。`,
            },
          ],
        };
      }

      // 任務管理工具（僅當功能啟用時可用）
      case 'create_task': {
        if (!taskService) throw new Error('任務管理功能未啟用或不可用');
        
        const validated = CreateTaskSchema.parse(args);
        const task = await taskService.createTask(validated);
        
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
        if (!taskService) throw new Error('任務管理功能未啟用或不可用');
        
        const validated = ListTasksSchema.parse(args || {});
        const tasks = await taskService.getAllTasks(validated);
        
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
        if (!taskService) throw new Error('任務管理功能未啟用或不可用');
        
        const validated = GetTaskSchema.parse(args);
        const task = await taskService.getTask(validated.id);
        
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
          content: [{ type: 'text', text: taskDetails }],
        };
      }

      case 'update_task': {
        if (!taskService) throw new Error('任務管理功能未啟用或不可用');
        
        const validated = UpdateTaskSchema.parse(args);
        const task = await taskService.updateTask(validated.id, validated.updates);
        
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
        if (!taskService) throw new Error('任務管理功能未啟用或不可用');
        
        const validated = DeleteTaskSchema.parse(args);
        await taskService.deleteTask(validated.id);
        
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
        if (!taskService) throw new Error('任務管理功能未啟用或不可用');
        
        const stats = await taskService.getStatistics();

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

Overdue Tasks: ${stats.overdue}
Completion Rate: ${stats.total > 0 ? ((stats.byStatus.completed / stats.total) * 100).toFixed(1) : 0}%`;

        return {
          content: [{ type: 'text', text: statsText }],
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

// 啟動 MCP 伺服器
async function startMCPServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  const currentProject = projectManager.getCurrentProject();
  
  // Log to stderr to avoid interfering with stdio transport
  console.error('🚀 Universal Project Manager MCP Server started');
  console.error(`📋 Framework: ${config.project.name} v${config.project.version}`);
  console.error(`🎯 Current Project: ${currentProject?.name || 'None'} (${currentProject?.type || 'N/A'})`);
  console.error(`🔧 Available tools: ${generateTools().map(t => t.name).join(', ')}`);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('\n👋 Shutting down Universal Project Manager MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('\n👋 Shutting down Universal Project Manager MCP Server...');
  process.exit(0);
});

// Start server if run directly
if (require.main === module) {
  startMCPServer().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}

module.exports = { server, startMCPServer };