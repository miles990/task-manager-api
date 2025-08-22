#!/bin/bash

TOOL_NAME="$1"
TOOL_PARAMS="$2"

if [[ "$TOOL_NAME" == "Edit" ]] || [[ "$TOOL_NAME" == "Write" ]]; then
  if [[ "$TOOL_PARAMS" == *".js"* ]]; then
    echo "📝 Auto-formatting JavaScript file..."
    FILE_PATH=$(echo "$TOOL_PARAMS" | grep -o '"file_path":"[^"]*"' | cut -d'"' -f4)
    npx prettier --write "$FILE_PATH" 2>/dev/null
  fi
fi

if [[ "$TOOL_NAME" == "Bash" ]] && [[ "$TOOL_PARAMS" == *"npm install"* ]]; then
  echo "📦 Package installed. Running security audit..."
  npm audit --audit-level=moderate
fi