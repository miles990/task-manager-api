# Development Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd task-manager-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Create .env file
cp .env.example .env

# Edit configuration
nano .env
```

### 4. Initialize Database
```bash
# Database is auto-initialized on first run
npm start

# Or manually reset database
npm run db:reset
```

## Development Workflow

### Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run both API and MCP servers
npm run start:both
```

### Code Quality

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Format code
npm run format

# Type checking
npm run typecheck

# Run all checks
npm run pre-commit
```

### Testing

```bash
# Run all tests
npm test

# Run specific test file
node --test tests/task.test.js

# Run with coverage (if configured)
npm run test:coverage
```

## Project Structure

```
task-manager-api/
├── src/
│   ├── config/           # Configuration management
│   │   └── index.js      # Central config file
│   ├── core/            # Core business logic
│   │   ├── database/    # Database layer
│   │   │   ├── connection.js  # DB connection manager
│   │   │   └── migrations.js  # Migration system
│   │   ├── errors/      # Error handling
│   │   │   └── AppError.js    # Custom error class
│   │   ├── repositories/# Data access layer
│   │   │   └── taskRepository.js
│   │   └── schemas/     # Validation schemas
│   │       └── taskSchemas.js
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.js    # Error handling
│   │   ├── requestLogger.js   # Request logging
│   │   └── validation.js      # Input validation
│   ├── models/          # Data models
│   │   └── task.js      # Task model
│   ├── routes/          # API routes
│   │   └── tasks.js     # Task routes
│   ├── services/        # Business logic
│   │   └── taskService.js
│   ├── index.js         # API server entry
│   └── mcp-server.js    # MCP server
├── tests/               # Test files
├── docs/                # Documentation
├── scripts/             # Utility scripts
└── package.json         # Dependencies
```

## Architecture

### Layered Architecture

```
┌─────────────┐
│   Routes    │  HTTP endpoints
├─────────────┤
│ Middleware  │  Request processing
├─────────────┤
│  Services   │  Business logic
├─────────────┤
│ Repository  │  Data access
├─────────────┤
│  Database   │  SQLite storage
└─────────────┘
```

### Data Flow

1. **Request** → Router → Middleware → Service
2. **Service** → Repository → Database
3. **Response** ← Service ← Repository ← Database

## Key Concepts

### Error Handling

Use the custom `AppError` class for consistent error handling:

```javascript
const AppError = require('../core/errors/AppError');

// Throw custom error
throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');

// Or use static methods
throw AppError.notFound('Task', id);
throw AppError.validationError(errors);
```

### Validation

Use Zod schemas for input validation:

```javascript
const { CreateTaskSchema } = require('../core/schemas/taskSchemas');

// Validate data
const validated = CreateTaskSchema.parse(data);
```

### Async Operations

Always use async/await with proper error handling:

```javascript
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(async (req, res) => {
  const tasks = await taskService.getAllTasks();
  res.json({ success: true, data: tasks });
}));
```

## Database

### Migrations

Migrations run automatically on startup. To add a new migration:

1. Edit `src/core/database/migrations.js`
2. Add migration to the `migrations` array:
```javascript
{
  version: 3,
  name: 'add_new_column',
  fn: this.addNewColumn.bind(this)
}
```
3. Implement the migration method

### Direct Database Access

```javascript
const dbConnection = require('./core/database/connection');
const db = dbConnection.getInstance();

// Run query
const result = db.prepare('SELECT * FROM tasks').all();
```

## Adding New Features

### 1. New API Endpoint

```javascript
// src/routes/tasks.js
router.get('/new-endpoint', 
  validateRequest(NewSchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await taskService.newMethod(req.query);
    res.json({ success: true, data: result });
  })
);
```

### 2. New Service Method

```javascript
// src/services/taskService.js
async newMethod(params) {
  // Validate input
  const validated = NewSchema.parse(params);
  
  // Business logic
  const result = await this.repository.newQuery(validated);
  
  // Return formatted result
  return this.formatResult(result);
}
```

### 3. New Repository Method

```javascript
// src/core/repositories/taskRepository.js
async newQuery(params) {
  const sql = 'SELECT * FROM tasks WHERE condition = ?';
  return this.db.prepare(sql).all(params.value);
}
```

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_PATH=./data/tasks.db
DATABASE_VERBOSE=false

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# CORS
CORS_ORIGIN=*

# MCP
MCP_ENABLED=true
MCP_STDIO=false
```

## Debugging

### Enable Debug Logging

```bash
# Set log level
LOG_LEVEL=debug npm run dev

# Enable SQL logging
DATABASE_VERBOSE=true npm run dev
```

### Using Node Inspector

```bash
# Start with inspector
node --inspect src/index.js

# With breakpoint
node --inspect-brk src/index.js
```

### Common Issues

1. **Module not found errors**
   - Check import/require paths
   - Ensure dependencies are installed
   - Verify file extensions

2. **Database locked errors**
   - Close other connections
   - Check file permissions
   - Use WAL mode (already configured)

3. **Port already in use**
   - Change PORT in .env
   - Kill existing process: `lsof -i :3000`

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation

### Commit Messages
```bash
# Format: <type>: <description>

feat: add batch task creation
fix: resolve database connection issue
refactor: improve error handling
docs: update API documentation
test: add service layer tests
```

### Pre-commit Checks
```bash
# Run before committing
npm run pre-commit
```

## Performance Tips

1. **Use Database Indexes**
   - Already configured for common queries
   - Add new indexes in migrations

2. **Implement Caching**
   - Consider Redis for frequently accessed data
   - Use in-memory cache for static data

3. **Optimize Queries**
   - Use prepared statements (already implemented)
   - Limit result sets
   - Use pagination for large lists

4. **Monitor Performance**
   - Check request logger for slow requests
   - Use performance monitoring middleware
   - Profile database queries

## Security Best Practices

1. **Input Validation**
   - Always validate user input
   - Use parameterized queries
   - Sanitize data before storage

2. **Error Messages**
   - Don't expose sensitive information
   - Use generic messages in production
   - Log detailed errors server-side only

3. **Dependencies**
   - Keep dependencies updated
   - Run security audits: `npm audit`
   - Fix vulnerabilities: `npm audit fix`

4. **Environment Variables**
   - Never commit .env files
   - Use different values for production
   - Rotate secrets regularly

## Deployment

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure production database
- [ ] Set up logging service
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test error handling
- [ ] Review security settings
- [ ] Document API endpoints