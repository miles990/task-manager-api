#!/bin/bash

echo "🔍 Running pre-commit hooks..."

echo "📝 Formatting code..."
npm run format

echo "🔧 Running linter..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix errors before committing."
  exit 1
fi

echo "🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix failing tests before committing."
  exit 1
fi

echo "✅ All pre-commit checks passed!"