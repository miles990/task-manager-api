# 🚀 Universal Project Manager - 使用指南

這個框架已經成功改造成一個獨立的通用專案管理工具，可以管理任何類型的專案！

## ✅ 已完成的改造

### 1. **核心功能**
- ✅ 通用配置系統（`config/projects.json`）
- ✅ 多專案管理支援
- ✅ 通用 MCP 服務器（`src/mcp-server-universal.js`）
- ✅ 專案初始化腳本（`setup.js`）
- ✅ 完整文檔系統

### 2. **主要文件**
- `setup.js` - 專案創建和管理腳本
- `src/mcp-server-universal.js` - 通用 MCP 服務器
- `src/config/projectManager.js` - 專案管理器
- `config/projects.json` - 專案配置文件
- `CLAUDE-UNIVERSAL.md` - Claude Code 通用指引
- `QUICK_START_UNIVERSAL.md` - 快速開始指南

## 📋 快速開始

### 步驟 1: Clone 框架
```bash
git clone [repository-url] my-project-manager
cd my-project-manager
npm install
```

### 步驟 2: 初始化框架
```bash
node setup.js framework
```

### 步驟 3: 創建第一個專案
```bash
# 創建 Node.js API 專案
node setup.js node-api my-api ./projects/my-api

# 創建 React 專案
node setup.js react-app my-frontend ./projects/my-frontend

# 創建 Python API 專案
node setup.js python-api my-python-api ./projects/my-python-api

# 添加現有專案
node setup.js existing my-existing-project /path/to/existing/project
```

### 步驟 4: 啟動框架 MCP 服務器
```bash
npm run start:framework
```

### 步驟 5: 在 Claude Code 中使用

在 Claude Code 中，你現在可以使用以下 MCP 工具：

```javascript
// 查看框架狀態
mcp__universal-project-manager__get_framework_status()

// 列出所有專案
mcp__universal-project-manager__list_projects()

// 切換專案
mcp__universal-project-manager__switch_project("my-api")

// 創建任務（如果專案支援）
mcp__universal-project-manager__create_task({
  title: "實作新功能",
  priority: "high",
  tags: ["feature"]
})
```

## 🎯 專案類型

| 類型 | 描述 | MCP 支援 | 任務管理 |
|------|------|----------|----------|
| `node-api` | Node.js API 專案 | ✅ | ✅ |
| `react-app` | React 前端專案 | ❌ | ❌ |
| `python-api` | Python API 專案 | ✅ | 🔧 |
| `go-api` | Go API 專案 | ✅ | 🔧 |
| `existing` | 現有專案 | 自動偵測 | 依功能 |

## 🔧 配置管理

### 專案配置文件位置
`config/projects.json`

### 配置結構
```json
{
  "framework": {
    "name": "Universal Project Manager",
    "version": "2.0.0"
  },
  "defaultProject": "my-api",
  "projects": {
    "my-api": {
      "name": "my-api",
      "type": "node-api",
      "rootPath": "./projects/my-api",
      "config": {...},
      "features": {...},
      "scripts": {...}
    }
  }
}
```

### 環境變數
```bash
# .env 文件
DEFAULT_PROJECT=my-api
FRAMEWORK_PORT=3001
MCP_SERVER_NAME=universal-project-manager
```

## 📚 完整文檔

- `CLAUDE-UNIVERSAL.md` - Claude Code 整合指引
- `QUICK_START_UNIVERSAL.md` - 詳細快速開始指南
- `README-UNIVERSAL.md` - 框架概述

## 💡 使用技巧

### 1. 管理多個專案
```bash
# 創建多個專案
node setup.js node-api api-1 ./projects/api-1
node setup.js node-api api-2 ./projects/api-2
node setup.js react-app frontend ./projects/frontend

# 在 Claude Code 中切換
mcp__universal-project-manager__switch_project("api-1")
```

### 2. 自訂專案類型
編輯 `setup.js` 添加新的專案模板：
```javascript
this.templates['custom-type'] = {
  description: '自訂專案類型',
  files: {...},
  directories: [...]
}
```

### 3. 整合現有專案
```bash
# 添加現有專案
node setup.js existing legacy-app /path/to/legacy/app

# 框架會自動偵測專案類型和功能
```

## 🤖 Claude Code 整合

### 自動化工作流
1. 創建專案時自動初始化 Git
2. 自動安裝依賴
3. 自動生成配置文件
4. 自動註冊到框架管理

### Agent 協作
所有原有的 Agent 功能都保留：
- `task-manager-specialist` - 任務管理
- `code-reviewer` - 程式碼審查
- `test-generator` - 測試生成
- `api-documenter` - 文檔生成
- 等等...

## ✨ 優勢

1. **統一管理** - 一個框架管理所有專案
2. **靈活配置** - 支援多種專案類型
3. **MCP 整合** - 與 Claude Code 深度整合
4. **向後相容** - 保留所有原有功能
5. **易於擴展** - 簡單添加新專案類型

## 🎉 完成！

現在你擁有了一個完全獨立、可配置的專案管理框架，可以：
- ✅ 管理任何類型的專案
- ✅ 與 Claude Code 完美整合
- ✅ 保留所有智能化功能
- ✅ 支援多專案同時管理
- ✅ 簡單配置即可使用

開始使用：
```bash
node setup.js framework
node setup.js node-api my-first-project
npm run start:framework
```

享受你的新框架！ 🚀