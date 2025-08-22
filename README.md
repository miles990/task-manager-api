# 📋 Task Manager API

A demonstration of Claude Code best practices - A RESTful API for task management with SQLite persistence and MCP integration.

## 🚀 Features

- **RESTful API** - Complete CRUD operations for task management
- **SQLite Database** - Persistent data storage with automatic migrations
- **MCP Integration** - Model Context Protocol server for AI assistant integration
- **Validation** - Input validation using Zod schemas
- **Error Handling** - Centralized error handling with custom AppError class
- **Logging** - Request logging with performance monitoring
- **Configuration** - Environment-based configuration management

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd task-manager-api

# Install dependencies
npm install

# Initialize database (automatically runs on first start)
npm start
```

## 🔧 Configuration

Create a `.env` file for custom configuration:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/tasks.db
LOG_LEVEL=info
```

## 🏃‍♂️ Running the Application

```bash
# Start REST API server
npm start

# Start in development mode (auto-reload)
npm run dev

# Start MCP server
npm run start:mcp

# Start both servers
npm run start:both
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Health Check
```http
GET /health
```

#### API Information
```http
GET /api
```

#### Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks with optional filters |
| GET | `/api/tasks/:id` | Get a specific task |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update task fields |
| PUT | `/api/tasks/:id` | Replace entire task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/tasks/stats` | Get task statistics |
| POST | `/api/tasks/batch` | Create multiple tasks |
| POST | `/api/tasks/archive` | Archive old completed tasks |

### Request Examples

#### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task manager API",
    "priority": "high",
    "status": "in_progress",
    "tags": ["development", "api"]
  }'
```

#### List Tasks with Filters
```bash
curl "http://localhost:3000/api/tasks?status=pending&priority=high"
```

#### Batch Create Tasks
```bash
curl -X POST http://localhost:3000/api/tasks/batch \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {"title": "Task 1", "priority": "high"},
      {"title": "Task 2", "priority": "medium"}
    ]
  }'
```

## 📊 Task Schema

```typescript
interface Task {
  id: string;          // UUID
  title: string;       // Required, max 200 chars
  description?: string;// Optional, max 2000 chars
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;   // Optional
  dueDate?: string;    // ISO 8601 datetime
  tags: string[];      // Array of tags
  createdAt: string;   // ISO 8601 datetime
  updatedAt: string;   // ISO 8601 datetime
}
```

## 🏗️ Project Structure

```
src/
├── config/           # Configuration management
├── core/            # Core business logic
│   ├── database/    # Database connection & migrations
│   ├── errors/      # Custom error classes
│   ├── repositories/# Data access layer
│   └── schemas/     # Validation schemas
├── middleware/      # Express middleware
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
└── index.js         # Application entry point
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run typecheck
```

## 🛠️ Development Scripts

```bash
# Reset database
npm run db:reset

# Test MCP server
npm run mcp:test

# Pre-commit checks
npm run pre-commit
```

## 🔌 MCP Integration

The project includes a Model Context Protocol (MCP) server that allows AI assistants to interact with the task management system.

### MCP Tools Available

- `create_task` - Create a new task
- `list_tasks` - List tasks with filters
- `get_task` - Get task by ID
- `update_task` - Update existing task
- `delete_task` - Delete a task
- `get_task_stats` - Get task statistics

### MCP Configuration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "task-manager": {
      "command": "node",
      "args": ["/path/to/task-manager-api/src/mcp-server.js"]
    }
  }
}
```

## 🚀 Production Deployment

### Environment Variables

```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=/var/data/tasks.db
LOG_LEVEL=error
CORS_ORIGIN=https://yourdomain.com
```

### Database Backup

```bash
# Backup database
cp data/tasks.db backups/tasks-$(date +%Y%m%d).db

# Restore database
cp backups/tasks-20240101.db data/tasks.db
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Claude Code best practices