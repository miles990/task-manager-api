# Task Manager API - Claude Code 最佳實踐範例

這是一個展示 Claude Code 最佳實踐的範例專案，實作了完整的任務管理 RESTful API。

## 🎯 專案特色

### Claude Code 最佳實踐展示

1. **Sub-agents 配置** - 專業化的 AI 助手
2. **Hooks 自動化** - 生命週期自動化處理
3. **MCP 整合** - 外部服務整合範例
4. **程式碼品質工具** - ESLint、Prettier、TypeScript
5. **測試驅動開發** - 完整的測試覆蓋

## 🚀 快速開始

### 安裝依賴
```bash
cd task-manager-api
npm install
```

### 啟動服務
```bash
npm start          # 生產模式
npm run dev        # 開發模式（自動重載）
```

### 運行測試
```bash
npm test           # 運行所有測試
npm run lint       # 程式碼檢查
npm run format     # 程式碼格式化
```

## 📚 API 端點

### 健康檢查
- `GET /health` - 服務健康狀態

### 任務管理
- `GET /api/tasks` - 獲取所有任務（支援篩選）
- `GET /api/tasks/:id` - 獲取單一任務
- `POST /api/tasks` - 創建新任務
- `PATCH /api/tasks/:id` - 更新任務
- `DELETE /api/tasks/:id` - 刪除任務
- `GET /api/tasks/stats` - 獲取統計資訊

### 查詢參數
```javascript
// GET /api/tasks 支援的查詢參數
{
  status: 'pending|in_progress|completed|archived',
  priority: 'low|medium|high|urgent',
  assignee: 'string',
  tags: ['tag1', 'tag2'],
  search: 'keyword'
}
```

### 請求範例
```bash
# 創建任務
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "實作新功能",
    "description": "添加使用者認證",
    "priority": "high",
    "tags": ["backend", "auth"]
  }'

# 查詢進行中的高優先級任務
curl "http://localhost:3000/api/tasks?status=in_progress&priority=high"
```

## 🤖 Claude Code Sub-agents

### 已配置的 Sub-agents

#### 1. code-reviewer
```bash
# 自動觸發程式碼審查
# 在編寫程式碼後會主動執行
```

#### 2. test-generator
```bash
# 為新功能生成測試案例
claude: "Generate tests for the new feature"
```

#### 3. api-documenter
```bash
# 生成 API 文檔
claude: "Document the API endpoints"
```

### 創建自定義 Sub-agent
```json
{
  "identifier": "your-agent",
  "description": "Agent description",
  "tools": ["read", "write", "bash"],
  "systemPrompt": "Your detailed instructions..."
}
```

## 🔧 Hooks 配置

### Pre-commit Hook
- 自動格式化程式碼
- 執行 linting 檢查
- 運行測試套件

### Post-tool-use Hook
- JavaScript 檔案自動格式化
- npm install 後的安全審計

### 設置 Hooks
```bash
# 使檔案可執行
chmod +x hooks/*.sh

# Claude Code 會自動讀取 .claude/hooks.json
```

## 🔌 MCP 整合

### 可用的 MCP 服務器

#### SQLite 資料庫
```bash
claude mcp add database -s project -- \
  npx @modelcontextprotocol/server-sqlite --db-path ./tasks.db
```

#### GitHub 整合
```bash
claude mcp add github -s user --env GITHUB_TOKEN=$GITHUB_TOKEN -- \
  npx @modelcontextprotocol/server-github
```

#### Slack 通知
```bash
claude mcp add slack -s project --env SLACK_TOKEN=$SLACK_TOKEN -- \
  npx @modelcontextprotocol/server-slack
```

### 使用範例
```javascript
import { mcpIntegration } from './integrations/mcp-example.js';

// 創建 GitHub Issue
await mcpIntegration.createGitHubIssue(task);

// 發送 Slack 通知
await mcpIntegration.sendSlackNotification(task, previousStatus);
```

## 📂 專案結構

```
task-manager-api/
├── src/
│   ├── index.js           # 應用程式入口
│   ├── models/            # 資料模型
│   │   └── task.js
│   ├── services/          # 商業邏輯
│   │   └── taskService.js
│   ├── routes/            # API 路由
│   │   └── tasks.js
│   ├── middleware/        # Express 中間件
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   └── integrations/      # MCP 整合範例
│       └── mcp-example.js
├── tests/                 # 測試檔案
│   └── task.test.js
├── hooks/                 # Claude Code Hooks
│   ├── pre-commit.sh
│   └── post-tool-use.sh
├── .claude/               # Claude Code 配置
│   ├── hooks.json
│   ├── code-reviewer.json
│   ├── test-generator.json
│   └── api-documenter.json
├── docs/                  # 文檔
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── mcp-config.json
```

## 🏆 最佳實踐亮點

### 1. 錯誤處理
- 集中式錯誤處理中間件
- Zod 驗證錯誤的優雅處理
- 詳細的錯誤訊息

### 2. 程式碼品質
- TypeScript 類型檢查
- ESLint 程式碼規範
- Prettier 自動格式化
- 完整的測試覆蓋

### 3. API 設計
- RESTful 原則
- 一致的回應格式
- 請求日誌記錄
- 健康檢查端點

### 4. 開發流程
- Git hooks 自動化
- 測試驅動開發
- 持續整合準備

## 🔒 安全考量

- 輸入驗證（使用 Zod）
- 錯誤訊息不洩露敏感資訊
- 環境變數管理敏感配置
- 依賴安全審計

## 📝 授權

MIT License

## 🤝 貢獻

歡迎提交 Pull Requests 來改進這個範例專案！

---

*這是一個 Claude Code 最佳實踐的示範專案，展示如何充分利用 Claude Code 的強大功能來提升開發效率。*