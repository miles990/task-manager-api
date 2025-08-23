# Universal Project Manager 🌍

> 基於 Claude Code 最佳實踐的通用專案管理框架

## 📖 概述

Universal Project Manager 是從原本的 Task Manager API 擴展而來的通用專案管理框架。它保留了所有原有的智能化功能（Agent 協作、自動化工作流等），並將這些能力擴展到支援任何類型的專案。

### ✨ 核心特色

- **🌐 多專案統一管理**: Node.js、React、Python、Go 等多種專案類型
- **🤖 智能 MCP 整合**: 根據專案類型動態載入對應的 MCP 工具
- **⚡ 自動化工作流**: 完整保留原有的 Agent 協作和自動化功能
- **🔧 靈活配置系統**: 基於配置文件的專案管理，支援動態切換
- **📦 模板化創建**: 內建多種專案模板，快速啟動新專案
- **🔄 向後相容**: 完全保留原有 Task Manager 功能

## 🚀 快速開始

### 1. 初始化框架
```bash
# 初始化通用專案管理框架
node setup.js framework

# 或使用 npm 腳本
npm run setup:framework
```

### 2. 創建專案
```bash
# Node.js API 專案 (具備任務管理功能)
node setup.js node-api my-api ./projects/my-api

# React 前端專案
node setup.js react-app my-frontend ./projects/my-frontend

# Python API 專案
node setup.js python-api my-python-api ./projects/my-python-api

# Go API 專案
node setup.js go-api my-go-api ./projects/my-go-api

# 添加現有專案
node setup.js existing legacy-project ./existing/path
```

### 3. 啟動框架
```bash
# 啟動通用 MCP 伺服器
npm run start:framework

# 查看框架狀態
npm run framework:status
```

## 🎯 MCP 工具使用

### 框架管理工具（通用）
```javascript
// 查看框架和所有專案狀態
mcp__universal-project-manager__get_framework_status()

// 列出所有專案
mcp__universal-project-manager__list_projects()

// 查看特定專案詳情
mcp__universal-project-manager__get_project_info(projectName="my-project")

// 切換到不同專案
mcp__universal-project-manager__switch_project(projectName="my-api")

// 添加新專案到框架
mcp__universal-project-manager__add_project({
  name: "new-project",
  type: "react-app",
  description: "New React application"
})
```

### 專案特定工具（動態載入）
根據當前專案類型和功能，會自動載入相應工具：

```javascript
// 任務管理工具（僅限具備 taskManagement 功能的專案）
mcp__universal-project-manager__create_task(title="New feature")
mcp__universal-project-manager__list_tasks(status="in_progress")
mcp__universal-project-manager__update_task(id="uuid", updates={status:"completed"})
mcp__universal-project-manager__get_task_stats()

// API 專案特定工具（node-api, python-api, go-api）
mcp__universal-project-manager__test_api_endpoints()
mcp__universal-project-manager__generate_api_docs()

// 前端專案特定工具（react-app）
mcp__universal-project-manager__test_components()
mcp__universal-project-manager__build_optimize()
```

## 📁 專案結構

```
universal-project-manager/
├── config/
│   └── projects.json          # 專案配置管理
├── src/
│   ├── config/
│   │   ├── index.js           # 通用配置系統
│   │   └── projectManager.js  # 專案管理器
│   ├── mcp-server.js          # 原始 Task Manager MCP (向後相容)
│   ├── mcp-server-universal.js # 通用 MCP 伺服器
│   └── [其他原有文件...]
├── setup.js                   # 專案創建和管理腳本
├── CLAUDE-UNIVERSAL.md        # 通用框架指引
├── QUICK_START_UNIVERSAL.md   # 快速開始指南
└── README-UNIVERSAL.md        # 本文件
```

## 🔧 配置系統

### 主配置文件：`config/projects.json`
```json
{
  "framework": {
    "name": "Universal Project Manager",
    "version": "2.0.0"
  },
  "defaultProject": "my-main-project",
  "projects": {
    "my-api": {
      "name": "My API Project",
      "type": "node-api",
      "rootPath": "/path/to/project",
      "features": {
        "taskManagement": true,
        "apiServer": true,
        "database": true,
        "mcp": true
      },
      "config": {
        "api": { "port": 3000 },
        "database": { "type": "sqlite", "path": "./data/app.db" },
        "mcp": { "enabled": true, "serverName": "my-api" }
      }
    }
  }
}
```

### 動態配置載入
框架會根據專案類型和功能自動調整配置，支援：
- 環境變數覆蓋
- 專案特定配置
- 全域預設設定
- 動態工具載入

## 🌟 支援的專案類型

| 專案類型 | MCP 支援 | 任務管理 | 特殊功能 |
|----------|----------|----------|----------|
| **node-api** | ✅ 完整 | ✅ | Express、SQLite、完整 API |
| **react-app** | ❌ | ❌ | 前端專用工具、元件測試 |
| **python-api** | ✅ 完整 | 🔧 可選 | FastAPI、異步處理 |
| **go-api** | ✅ 完整 | 🔧 可選 | 高效能、並發處理 |
| **existing** | 🔧 依類型 | 🔧 依功能 | 自動偵測和整合 |

## ⚡ 智能工作流程

### 1. 多專案開發流程
```
專案A開發 → 切換到專案B → 檢查依賴關係 → 協調開發 → 整合測試 → 統一發布
```

### 2. 自動化觸發機制
- **專案切換**: 自動載入專案特定 MCP 工具
- **功能偵測**: 根據專案功能動態調整可用工具
- **依賴管理**: 自動處理專案間的依賴關係
- **測試協調**: 跨專案的整合測試支援

### 3. Agent 協作增強
保留並擴展原有的 Agent 系統：
- **專案感知**: 所有 Agent 都能感知當前專案類型
- **工具動態載入**: 根據專案特性載入專用工具
- **跨專案協作**: 支援多專案的協作開發

## 🛠️ 開發和維護

### 常用命令
```bash
# 框架管理
npm run start:framework      # 啟動通用 MCP 伺服器
npm run framework:status     # 查看框架狀態
npm run setup               # 查看設置幫助

# 專案管理
node setup.js               # 顯示所有可用命令
node setup.js framework     # 重新初始化框架
node setup.js [type] [name] # 創建新專案

# 開發工作流
npm run start               # 啟動當前專案 (原始 Task Manager)
npm run test                # 運行測試
npm run lint                # 程式碼檢查
```

### 故障排除
1. **MCP 工具不可用**: 檢查專案是否正確切換
2. **配置問題**: 使用 `npm run framework:status` 診斷
3. **專案創建失敗**: 檢查路徑權限和模板定義

## 🔄 從原有系統遷移

### 完全向後相容
- 原有的 Task Manager API 功能完全保留
- 原有的 MCP 工具仍然可用
- 原有的資料庫和數據完全保留
- 原有的設定檔案繼續有效

### 升級步驟
1. **保留現有功能**: 無需任何更改即可繼續使用原有功能
2. **初始化框架**: 運行 `node setup.js framework` 啟用新功能
3. **添加新專案**: 使用新的專案創建功能
4. **逐步切換**: 根據需要逐步使用新的通用 MCP 工具

## 📚 文檔和指引

- **[CLAUDE-UNIVERSAL.md](./CLAUDE-UNIVERSAL.md)**: 完整的框架使用指引
- **[QUICK_START_UNIVERSAL.md](./QUICK_START_UNIVERSAL.md)**: 快速開始指南
- **[CLAUDE.md](./CLAUDE.md)**: 原始 Task Manager 指引（向後相容）
- **[mcp-config.json](./mcp-config.json)**: MCP 伺服器配置範例

## 🤝 貢獻和擴展

### 添加新的專案類型
1. 在 `setup.js` 中添加新模板
2. 更新 `src/mcp-server-universal.js` 中的工具定義
3. 添加對應的配置和功能支援

### 自定義 MCP 工具
1. 在通用 MCP 伺服器中添加工具定義
2. 實作工具邏輯和驗證
3. 更新文檔和測試

## 🎉 結語

Universal Project Manager 讓您能夠：

- **保留原有所有功能**: Task Manager API 的所有功能完全保留
- **擴展到任意專案**: 統一管理各種類型的專案
- **享受智能協作**: 完整的 Agent 系統和自動化工作流
- **靈活配置管理**: 基於配置的專案管理，適應任何需求

從單一專案的任務管理工具，擴展為支援任何專案的通用管理框架 - 這就是 Universal Project Manager 的力量！

---

**立即開始使用 Universal Project Manager，讓每個專案都成為 Claude Code 的最佳實踐範例！** 🚀