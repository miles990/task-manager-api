#!/bin/bash

# Task Manager MCP Server Registration Script
# This script registers the task-manager-api as an MCP server with Claude Code

echo "🔧 Registering Task Manager MCP Server with Claude Code..."

# Get the current directory
CURRENT_DIR=$(pwd)

# Check if we're in the right directory
if [ ! -f "src/mcp-server.js" ]; then
    echo "❌ Error: src/mcp-server.js not found. Please run this script from the project root."
    exit 1
fi

# Register the MCP server with Claude Code
echo "📝 Adding task-manager MCP server to Claude Code..."

# Use absolute path for the MCP server
claude mcp add task-manager \
    --scope project \
    -- node "${CURRENT_DIR}/src/mcp-server.js"

if [ $? -eq 0 ]; then
    echo "✅ Successfully registered Task Manager MCP Server!"
    echo ""
    echo "📋 Available tools in Claude Code:"
    echo "  • create_task - Create a new task"
    echo "  • list_tasks - List all tasks with filters"
    echo "  • get_task - Get details of a specific task"
    echo "  • update_task - Update an existing task"
    echo "  • delete_task - Delete a task"
    echo "  • get_task_stats - Get task statistics"
    echo ""
    echo "💡 Usage example in Claude Code:"
    echo '   "Create a new task for implementing user authentication with high priority"'
    echo '   "List all pending tasks"'
    echo '   "Update task <id> to completed status"'
    echo ""
    echo "🚀 The MCP server is now available in Claude Code!"
else
    echo "❌ Failed to register MCP server. Please check your Claude Code installation."
    exit 1
fi