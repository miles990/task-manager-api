# Project Structure

## 📁 Directory Overview

```
task-manager-api/
├── 📄 .env.example          # Environment variables template
├── 📄 .gitignore           # Git ignore rules
├── 📄 .eslintrc.json       # ESLint configuration
├── 📄 CLAUDE.md            # Claude Code instructions
├── 📄 README.md            # Project documentation
├── 📄 package.json         # Dependencies and scripts
├── 📄 tsconfig.json        # TypeScript configuration
│
├── 📁 .claude/             # Claude Code configuration
│   └── 📁 sub-agents/      # Sub-agent definitions
│
├── 📁 docs/                # Documentation
│   ├── 📄 API.md           # API documentation
│   ├── 📄 DEVELOPMENT.md   # Development guide
│   ├── 📄 MCP_INTEGRATION.md # MCP integration guide
│   └── 📄 REFACTORING_SUMMARY.md # Refactoring details
│
├── 📁 scripts/             # Utility scripts
│   ├── 📄 reset-database.js    # Database reset script
│   ├── 📄 test-mcp-server.js   # MCP testing script
│   └── 📄 verify-mcp.sh        # MCP verification
│
├── 📁 src/                 # Source code
│   ├── 📄 index.js         # API server entry point
│   ├── 📄 mcp-server.js    # MCP server implementation
│   │
│   ├── 📁 config/          # Configuration
│   │   └── 📄 index.js     # Central configuration
│   │
│   ├── 📁 core/            # Core business logic
│   │   ├── 📁 database/    # Database layer
│   │   │   ├── 📄 connection.js  # DB connection
│   │   │   └── 📄 migrations.js  # DB migrations
│   │   │
│   │   ├── 📁 errors/      # Error handling
│   │   │   └── 📄 AppError.js    # Custom error class
│   │   │
│   │   ├── 📁 repositories/# Data access layer
│   │   │   └── 📄 taskRepository.js
│   │   │
│   │   └── 📁 schemas/     # Validation schemas
│   │       └── 📄 taskSchemas.js
│   │
│   ├── 📁 middleware/      # Express middleware
│   │   ├── 📄 errorHandler.js   # Error handling
│   │   ├── 📄 requestLogger.js  # Request logging
│   │   └── 📄 validation.js     # Input validation
│   │
│   ├── 📁 models/          # Data models
│   │   └── 📄 task.js      # Task model
│   │
│   ├── 📁 routes/          # API routes
│   │   └── 📄 tasks.js     # Task endpoints
│   │
│   └── 📁 services/        # Business logic
│       └── 📄 taskService.js
│
├── 📁 tests/               # Test files
│   └── 📄 task.test.js     # Task tests
│
├── 📁 data/                # Database files (gitignored)
│   └── 📄 tasks.db         # SQLite database
│
└── 📁 node_modules/        # Dependencies (gitignored)
```

## 🏗️ Architecture Layers

### 1. **Routes Layer** (`src/routes/`)
- Handles HTTP requests and responses
- Defines API endpoints
- Delegates to service layer

### 2. **Service Layer** (`src/services/`)
- Contains business logic
- Orchestrates operations
- Validates business rules

### 3. **Repository Layer** (`src/core/repositories/`)
- Handles data persistence
- Database queries
- Data transformation

### 4. **Database Layer** (`src/core/database/`)
- Database connection management
- Migration system
- Raw database operations

### 5. **Middleware Layer** (`src/middleware/`)
- Request/response processing
- Error handling
- Logging and monitoring
- Input validation

## 📝 Key Files

### Configuration
- `src/config/index.js` - Central configuration management
- `.env.example` - Environment variables template
- `CLAUDE.md` - Claude Code specific instructions

### Core Components
- `src/core/errors/AppError.js` - Custom error handling
- `src/core/schemas/taskSchemas.js` - Validation schemas
- `src/core/database/connection.js` - Database connection
- `src/core/database/migrations.js` - Database migrations

### API Implementation
- `src/index.js` - Express server setup
- `src/routes/tasks.js` - Task API endpoints
- `src/services/taskService.js` - Business logic
- `src/core/repositories/taskRepository.js` - Data access

### MCP Integration
- `src/mcp-server.js` - MCP server implementation
- `mcp-config.json` - MCP configuration

## 🔄 Data Flow

```
Request → Router → Middleware → Service → Repository → Database
   ↑                                                        ↓
Response ← Middleware ← Service ← Repository ← Database ←─┘
```

## 📦 Dependencies

### Production
- `express` - Web framework
- `better-sqlite3` - SQLite database
- `zod` - Schema validation
- `uuid` - UUID generation
- `@modelcontextprotocol/sdk` - MCP integration

### Development
- `eslint` - Code linting
- `prettier` - Code formatting
- `typescript` - Type checking
- `@types/*` - TypeScript definitions

## 🚀 Quick Start

1. **Install**: `npm install`
2. **Configure**: Copy `.env.example` to `.env`
3. **Run**: `npm start`
4. **Develop**: `npm run dev`
5. **Test**: `npm test`

## 📚 Documentation

- [README.md](README.md) - Project overview
- [docs/API.md](docs/API.md) - API reference
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development guide
- [docs/MCP_INTEGRATION.md](docs/MCP_INTEGRATION.md) - MCP setup