# API Documentation

## Base Information

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **API Version**: `1.0.0`

## Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}, // Optional additional details
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_JSON` | 400 | Invalid JSON in request body |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `TASK_NOT_FOUND` | 404 | Task with specified ID not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `DATABASE_ERROR` | 500 | Database operation failed |

## Endpoints

### Health Check

Check if the API is running and healthy.

```http
GET /health
```

**Response (200 OK)**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

### API Information

Get general information about the API.

```http
GET /api
```

**Response (200 OK)**
```json
{
  "name": "Task Manager API",
  "version": "1.0.0",
  "description": "A demonstration of Claude Code best practices",
  "endpoints": {
    "health": "/health",
    "tasks": "/api/tasks",
    "stats": "/api/tasks/stats",
    "documentation": "/api/docs"
  }
}
```

### List Tasks

Retrieve a list of tasks with optional filters.

```http
GET /api/tasks
```

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: pending, in_progress, completed, archived |
| `priority` | string | Filter by priority: low, medium, high, urgent |
| `assignee` | string | Filter by assignee name |
| `tag` | string | Filter by tag |
| `search` | string | Search in title and description |
| `limit` | number | Maximum number of results (max: 100) |

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project",
      "description": "Finish the task manager API",
      "status": "in_progress",
      "priority": "high",
      "assignee": "John Doe",
      "dueDate": "2025-01-31T23:59:59.000Z",
      "tags": ["development", "api"],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1,
  "filters": {
    "status": "in_progress"
  }
}
```

### Get Task by ID

Retrieve a specific task by its ID.

```http
GET /api/tasks/:id
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project",
    "description": "Finish the task manager API",
    "status": "in_progress",
    "priority": "high",
    "assignee": "John Doe",
    "dueDate": "2025-01-31T23:59:59.000Z",
    "tags": ["development", "api"],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Create Task

Create a new task.

```http
POST /api/tasks
```

**Request Body**
```json
{
  "title": "New task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "assignee": "John Doe",
  "dueDate": "2025-01-31T23:59:59.000Z",
  "tags": ["tag1", "tag2"]
}
```

**Required Fields**
- `title` (string, 1-200 characters)

**Optional Fields**
- `description` (string, max 2000 characters)
- `status` (enum: pending, in_progress, completed, archived) - default: "pending"
- `priority` (enum: low, medium, high, urgent) - default: "medium"
- `assignee` (string, max 100 characters)
- `dueDate` (ISO 8601 datetime string)
- `tags` (array of strings, max 10 tags, max 50 chars each)

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "New task",
    "description": "Task description",
    "status": "pending",
    "priority": "medium",
    "assignee": "John Doe",
    "dueDate": "2025-01-31T23:59:59.000Z",
    "tags": ["tag1", "tag2"],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

### Update Task (Partial)

Update specific fields of a task.

```http
PATCH /api/tasks/:id
```

**Request Body**
```json
{
  "status": "completed",
  "priority": "low"
}
```

All fields from Create Task are available for update except `id`, `createdAt`, and `updatedAt`.

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "New task",
    "description": "Task description",
    "status": "completed",
    "priority": "low",
    "assignee": "John Doe",
    "dueDate": "2025-01-31T23:59:59.000Z",
    "tags": ["tag1", "tag2"],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  },
  "message": "Task updated successfully"
}
```

### Replace Task (Full)

Replace an entire task with new data.

```http
PUT /api/tasks/:id
```

**Request Body**
Same as Create Task - all fields except `id` will be replaced.

**Response (200 OK)**
```json
{
  "success": true,
  "data": { /* complete task object */ },
  "message": "Task replaced successfully"
}
```

### Delete Task

Delete a task by ID.

```http
DELETE /api/tasks/:id
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully",
    "id": "550e8400-e29b-41d4-a716-446655440000"
  },
  "message": "Task deleted successfully"
}
```

### Get Task Statistics

Get statistics about all tasks.

```http
GET /api/tasks/stats
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
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
}
```

### Batch Create Tasks

Create multiple tasks in a single request.

```http
POST /api/tasks/batch
```

**Request Body**
```json
{
  "tasks": [
    {
      "title": "Task 1",
      "priority": "high"
    },
    {
      "title": "Task 2",
      "description": "Description for task 2",
      "priority": "medium",
      "tags": ["batch", "api"]
    }
  ]
}
```

**Response (201 Created or 207 Multi-Status)**
```json
{
  "success": true,
  "data": {
    "created": [
      { /* task 1 object */ },
      { /* task 2 object */ }
    ],
    "errors": [],
    "success": true
  },
  "message": "Created 2 tasks"
}
```

If some tasks fail validation:
```json
{
  "success": false,
  "data": {
    "created": [
      { /* successfully created tasks */ }
    ],
    "errors": [
      {
        "index": 1,
        "error": "Validation failed"
      }
    ],
    "success": false
  },
  "message": "Created 1 tasks"
}
```

### Archive Old Tasks

Archive completed tasks older than specified days.

```http
POST /api/tasks/archive
```

**Request Body**
```json
{
  "days": 30
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "archivedCount": 5,
    "message": "Archived 5 tasks older than 30 days"
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP address
- **Error Code**: `RATE_LIMIT_EXCEEDED` (429)

## Pagination

For endpoints that return lists, pagination can be controlled with:
- `limit`: Maximum number of items to return (default: 50, max: 100)
- `offset`: Number of items to skip (for pagination)

## Sorting

List endpoints support sorting:
- `sortBy`: Field to sort by (createdAt, updatedAt, dueDate, priority)
- `sortOrder`: Sort direction (asc, desc)

## Authentication

Currently, the API does not require authentication. In production, implement:
- JWT token authentication
- API key authentication
- OAuth 2.0

## CORS

CORS is enabled by default in development. Configure allowed origins in production:
```env
CORS_ORIGIN=https://yourdomain.com
```