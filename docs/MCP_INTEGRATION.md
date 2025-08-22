# MCP (Model Context Protocol) Integration Guide

## Overview

This project includes a Model Context Protocol server that enables AI assistants to interact directly with the Task Manager API.

## Installation

### 1. Install MCP Server

The MCP server is already included in the project. No additional installation required.

### 2. Configure Claude Desktop

Add the following configuration to your Claude Desktop settings:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "task-manager": {
      "command": "node",
      "args": ["/absolute/path/to/task-manager-api/src/mcp-server.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

After updating the configuration, restart Claude Desktop for changes to take effect.

## Available MCP Tools

### create_task

Create a new task with specified details.

**Parameters:**
- `title` (required): Task title
- `description`: Detailed description
- `priority`: low, medium, high, urgent
- `status`: pending, in_progress, completed, archived
- `assignee`: Person assigned to the task
- `dueDate`: Due date in ISO format
- `tags`: Array of tags

**Example:**
```javascript
{
  "title": "Review pull request",
  "description": "Review and merge the feature branch",
  "priority": "high",
  "assignee": "John Doe",
  "tags": ["review", "development"]
}
```

### list_tasks

List all tasks with optional filters.

**Parameters:**
- `status`: Filter by status
- `priority`: Filter by priority
- `assignee`: Filter by assignee
- `tag`: Filter by tag
- `limit`: Maximum number of tasks to return

**Example:**
```javascript
{
  "status": "pending",
  "priority": "high",
  "limit": 10
}
```

### get_task

Get details of a specific task by ID.

**Parameters:**
- `id` (required): The UUID of the task

**Example:**
```javascript
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### update_task

Update an existing task with new values.

**Parameters:**
- `id` (required): The UUID of the task to update
- `updates`: Object containing fields to update

**Example:**
```javascript
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "updates": {
    "status": "completed",
    "priority": "low"
  }
}
```

### delete_task

Delete a task by ID.

**Parameters:**
- `id` (required): The UUID of the task to delete

**Example:**
```javascript
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### get_task_stats

Get statistics about all tasks.

**Parameters:** None

**Returns:**
```javascript
{
  "total": 42,
  "byStatus": {
    "pending": 10,
    "in_progress": 5,
    "completed": 25,
    "archived": 2
  },
  "byPriority": {
    "low": 8,
    "medium": 20,
    "high": 12,
    "urgent": 2
  },
  "overdue": 3
}
```

## Testing MCP Server

### Manual Testing

1. Start the MCP server:
```bash
npm run start:mcp
```

2. Use the test script:
```bash
npm run mcp:test
```

### Verification Script

Run the verification script to check MCP configuration:
```bash
./scripts/verify-mcp.sh
```

## Development

### MCP Server Structure

```javascript
// src/mcp-server.js
class TaskManagerMCPServer {
  constructor() {
    // Initialize server
  }
  
  async handleCreateTask(args) {
    // Handle task creation
  }
  
  async handleListTasks(args) {
    // Handle task listing
  }
  
  // ... other handlers
}
```

### Adding New Tools

1. Define the tool schema in `src/mcp-server.js`:
```javascript
{
  name: "new_tool",
  description: "Tool description",
  inputSchema: {
    type: "object",
    properties: {
      // Define parameters
    },
    required: ["requiredParam"]
  }
}
```

2. Add the handler method:
```javascript
async handleNewTool(args) {
  // Implement tool logic
  return result;
}
```

3. Register the handler:
```javascript
case "new_tool":
  return await this.handleNewTool(args);
```

## Best Practices

### 1. Error Handling

Always wrap MCP operations in try-catch blocks:
```javascript
try {
  const result = await taskService.createTask(args);
  return { success: true, data: result };
} catch (error) {
  return { success: false, error: error.message };
}
```

### 2. Input Validation

Use Zod schemas for input validation:
```javascript
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  priority: z.enum(['low', 'medium', 'high', 'urgent'])
});
```

### 3. Consistent Responses

Maintain consistent response format:
```javascript
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```

## Troubleshooting

### Common Issues

1. **MCP Server not connecting**
   - Check the absolute path in configuration
   - Ensure Node.js is in PATH
   - Restart Claude Desktop

2. **Tools not appearing in Claude**
   - Verify MCP server is running
   - Check for errors in server logs
   - Ensure configuration is valid JSON

3. **Database connection issues**
   - Check database file permissions
   - Ensure database directory exists
   - Verify SQLite is properly installed

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=mcp:* npm run start:mcp
```

## Security Considerations

1. **Input Sanitization**: All inputs are sanitized before processing
2. **SQL Injection Protection**: Using parameterized queries
3. **Rate Limiting**: Consider implementing rate limiting for MCP operations
4. **Authentication**: In production, add authentication layer

## Performance Optimization

1. **Database Indexing**: Indexes on commonly queried fields
2. **Connection Pooling**: Reuse database connections
3. **Caching**: Consider implementing Redis cache for frequently accessed data
4. **Batch Operations**: Use batch operations for multiple tasks

## Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Task dependencies and relationships
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Advanced search and filtering
- [ ] Export/Import functionality
- [ ] Webhook notifications
- [ ] Multi-user support with permissions