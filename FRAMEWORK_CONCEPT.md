# 🤖 Claude Code + MCP 自動化框架概念說明

## 📌 核心概念

這套框架是一個 **AI 驅動的開發助手系統**，結合了：

1. **Claude Code** - Anthropic 的 AI 編程助手
2. **MCP (Model Context Protocol)** - 讓 AI 與外部工具互動的協議
3. **智能 Agents** - 專門處理特定任務的 AI 助手

## 🎯 框架目的

**讓 AI 成為你的智能開發夥伴**，而不只是回答問題的工具。

### 傳統方式 vs 這套框架

#### ❌ 傳統方式（沒有框架）
```
你：「幫我寫一個 API」
AI：「這是程式碼...」
你：「幫我寫測試」
AI：「這是測試...」
你：「幫我審查程式碼」
AI：「這些地方需要改進...」

問題：
- 每次都要手動要求
- AI 不知道專案脈絡
- 沒有任務追蹤
- 無法自動化流程
```

#### ✅ 使用這套框架
```
你：「實作使用者認證功能」
AI 自動：
1. 創建任務追蹤 (MCP)
2. 規劃實作步驟 (TodoWrite)
3. 編寫程式碼
4. 生成測試 (test-generator Agent)
5. 審查程式碼 (code-reviewer Agent)
6. 更新文檔 (api-documenter Agent)
7. 執行測試
8. 報告完成狀態

結果：一個指令觸發完整工作流程
```

## 🔄 運作原理

### 1. CLAUDE.md - AI 的專案知識庫
```markdown
# CLAUDE.md
告訴 AI：
- 你的專案使用什麼技術
- 遵循什麼編碼規範
- 如何執行測試
- 自動化規則
```

**作用**：AI 讀取這個檔案後，就知道如何在你的專案中工作。

### 2. MCP (Model Context Protocol) - AI 的工具箱

MCP 讓 Claude Code 能夠：

```javascript
// 不只是生成程式碼，而是實際執行動作

// 創建任務
await mcp__task-manager__create_task({
  title: "實作登入功能",
  priority: "high"
});

// 追蹤進度
await mcp__task-manager__list_tasks();

// 更新狀態
await mcp__task-manager__update_task(id, {
  status: "completed"
});
```

**作用**：AI 可以實際操作工具，不只是告訴你怎麼做。

### 3. Agents - 專業化的 AI 助手

每個 Agent 都是專門訓練來處理特定任務的 AI：

| Agent | 專長 | 自動觸發時機 |
|-------|------|-------------|
| **task-manager-specialist** | 專案管理、任務協調 | 開始新工作時 |
| **test-generator** | 生成各種測試案例 | 新增功能時 |
| **code-reviewer** | 程式碼審查、最佳實踐 | 完成功能後 |
| **api-documenter** | API 文檔、OpenAPI 規範 | API 變更時 |
| **database-optimizer** | 資料庫優化、查詢分析 | 效能問題時 |

## 🚀 實際工作流程範例

### 範例：開發一個新的 API 端點

#### 你只需要說：
```
「幫我實作一個獲取使用者資料的 API」
```

#### AI 自動執行：

```javascript
// 1. 創建任務（MCP）
const task = await mcp__task-manager__create_task({
  title: "實作 GET /users/:id API",
  priority: "high",
  status: "in_progress"
});

// 2. 規劃步驟（TodoWrite）
await TodoWrite([
  { content: "設計 API 規格", status: "completed" },
  { content: "實作控制器", status: "in_progress" },
  { content: "添加驗證", status: "pending" },
  { content: "編寫測試", status: "pending" },
  { content: "更新文檔", status: "pending" }
]);

// 3. 實作程式碼
// AI 根據 CLAUDE.md 知道你用什麼框架
// Go: 使用 Gin
// Node: 使用 Express
// Python: 使用 FastAPI

// 4. 觸發 test-generator Agent
await Task({
  subagent_type: "test-generator",
  description: "生成 API 測試",
  prompt: "為 GET /users/:id 生成單元測試和整合測試"
});

// 5. 執行測試
await Bash({ command: "go test ./..." });  // 如果是 Go 專案

// 6. 觸發 code-reviewer Agent
await Task({
  subagent_type: "code-reviewer",
  description: "審查 API 實作",
  prompt: "檢查安全性、錯誤處理、最佳實踐"
});

// 7. 更新文檔
await Task({
  subagent_type: "api-documenter",
  description: "更新 API 文檔",
  prompt: "更新 OpenAPI 規範和 README"
});

// 8. 完成任務
await mcp__task-manager__update_task(task.id, {
  updates: { status: "completed" }
});

// 9. 報告
await mcp__task-manager__get_task_stats();
```

## 💡 關鍵優勢

### 1. **上下文感知**
AI 了解你的專案結構、技術棧、編碼規範，不需要每次都解釋。

### 2. **自動化流程**
一個指令觸發完整的開發流程，從規劃到測試到文檔。

### 3. **任務追蹤**
所有工作都被追蹤和記錄，隨時知道進度。

### 4. **專業分工**
不同的 Agent 處理不同的任務，就像一個開發團隊。

### 5. **即時執行**
AI 不只給建議，而是實際執行命令、運行測試、生成檔案。

## 🎨 使用場景

### 場景 1: 日常開發
```javascript
你：「修復使用者無法登入的 bug」

AI 自動：
1. 創建 bug 任務（優先級：urgent）
2. 分析問題
3. 寫測試重現 bug
4. 修復程式碼
5. 運行測試確認
6. 更新任務狀態
```

### 場景 2: 程式碼審查
```javascript
你：「審查我剛寫的程式碼」

AI 自動：
1. 觸發 code-reviewer Agent
2. 檢查程式碼品質
3. 找出潛在問題
4. 提供改進建議
5. 創建修復任務
```

### 場景 3: 專案規劃
```javascript
你：「我要開發一個電商網站」

AI 自動：
1. 初始化規格工作流（specs-workflow）
2. 分解成多個任務
3. 設定優先級和依賴
4. 創建開發時程表
5. 開始追蹤進度
```

## 🔧 技術架構

```
┌─────────────────────────────────────────┐
│            你的指令/需求                 │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│           Claude Code                    │
│         (AI 編程助手)                    │
│                                          │
│  讀取 CLAUDE.md 了解專案配置            │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│   MCP    │ │  Agents  │ │  Hooks   │
│          │ │          │ │          │
│ • 任務   │ │ • 測試   │ │ • 前置   │
│ • 規格   │ │ • 審查   │ │ • 後置   │
│ • 資料   │ │ • 文檔   │ │ • 自動   │
└──────────┘ └──────────┘ └──────────┘
    │            │            │
    └────────────┼────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│           實際執行                       │
│                                          │
│  • 執行命令 (Bash)                      │
│  • 讀寫檔案 (Read/Write)                │
│  • 修改程式碼 (Edit)                    │
│  • 搜尋程式碼 (Grep/Glob)               │
│  • 執行 Commands (/help, /clear)        │
└─────────────────────────────────────────┘
```

## 🪝 Hooks - 自動化觸發器

Hooks 是在特定事件發生時自動執行的腳本，讓工作流程更自動化。

### Hook 類型

#### 1. **Pre-hooks（前置鉤子）**
在執行操作前自動運行：

```bash
# .claude/hooks/pre-edit
#!/bin/bash
# 在編輯檔案前自動備份
cp $1 $1.backup
echo "✅ 已備份檔案"
```

#### 2. **Post-hooks（後置鉤子）**
在操作完成後自動執行：

```bash
# .claude/hooks/post-edit
#!/bin/bash
# 編輯後自動格式化
if [[ $1 == *.go ]]; then
  gofmt -w $1
  echo "✅ 已格式化 Go 檔案"
fi
```

#### 3. **Tool-hooks（工具鉤子）**
特定工具使用時觸發：

```yaml
# .claude/config.yml
hooks:
  post-tool-use:
    - command: "npm run lint"
      when: "file_changed:*.js"
    - command: "go fmt"
      when: "file_changed:*.go"
```

### Hook 實際應用

```javascript
// 自動化測試 Hook
{
  "hooks": {
    "post-code-change": {
      "pattern": "*.test.js",
      "action": "npm test -- --watch"
    },
    "pre-commit": {
      "actions": [
        "npm run lint",
        "npm test",
        "npm run build"
      ]
    },
    "post-task-complete": {
      "action": "mcp__task-manager__get_task_stats"
    }
  }
}
```

## 💻 Commands - 快捷指令

Claude Code 支援斜線命令快速執行常用操作：

### 內建 Commands

| 命令 | 功能 | 範例 |
|------|------|------|
| `/help` | 顯示幫助資訊 | `/help` |
| `/clear` | 清除對話歷史 | `/clear` |
| `/status` | 查看專案狀態 | `/status` |
| `/tasks` | 列出所有任務 | `/tasks` |
| `/test` | 執行測試 | `/test` |
| `/commit` | 創建 git commit | `/commit "fix: 修復登入問題"` |

### 自訂 Commands

在 CLAUDE.md 中定義：

```markdown
## Custom Commands

/deploy: npm run build && npm run deploy
/db-migrate: npm run migrate:latest
/api-test: npm run test:api
/review: 觸發 code-reviewer agent
```

使用範例：

```bash
# 在 Claude Code 中
/deploy
# 自動執行: npm run build && npm run deploy

/review
# 自動觸發: Task({ subagent_type: "code-reviewer", ... })
```

## 🤖 Agent 進階功能

### Agent 串接（Agent Chaining）

多個 Agent 協同工作：

```javascript
// Agent 工作流程
async function fullStackFeature(feature) {
  // 1. 規劃 Agent
  await Task({
    subagent_type: "general-purpose",
    description: "規劃功能",
    prompt: `分析並規劃 ${feature} 的實作步驟`
  });
  
  // 2. 後端 Agent
  await Task({
    subagent_type: "task-manager-specialist",
    description: "後端開發",
    prompt: "實作 API 端點和業務邏輯"
  });
  
  // 3. 前端 Agent（如果需要）
  await Task({
    subagent_type: "general-purpose",
    description: "前端開發",
    prompt: "實作使用者介面"
  });
  
  // 4. 測試 Agent
  await Task({
    subagent_type: "test-generator",
    description: "生成測試",
    prompt: "生成單元測試和整合測試"
  });
  
  // 5. 文檔 Agent
  await Task({
    subagent_type: "api-documenter",
    description: "更新文檔",
    prompt: "更新 API 文檔和使用指南"
  });
  
  // 6. 審查 Agent
  await Task({
    subagent_type: "code-reviewer",
    description: "最終審查",
    prompt: "審查完整實作"
  });
}
```

### Agent 條件觸發

根據條件自動選擇 Agent：

```javascript
// 智能 Agent 選擇
async function smartAgentSelection(task) {
  const analysis = await analyzeTask(task);
  
  if (analysis.type === 'bug') {
    // Bug 修復流程
    await Task({
      subagent_type: "general-purpose",
      description: "分析 bug",
      prompt: "找出問題根源"
    });
  } else if (analysis.type === 'performance') {
    // 效能優化
    await Task({
      subagent_type: "database-optimizer",
      description: "優化效能",
      prompt: "分析並優化效能瓶頸"
    });
  } else if (analysis.type === 'security') {
    // 安全審查
    await Task({
      subagent_type: "code-quality-guardian",
      description: "安全審查",
      prompt: "檢查安全漏洞"
    });
  }
}
```

## 🔄 完整工作流程整合

### 範例：完整的功能開發流程

```javascript
// 整合 MCP + Agent + Hooks + Commands
async function developFeatureComplete(featureName) {
  console.log(`🚀 開始開發: ${featureName}`);
  
  // 1. MCP: 創建主任務
  const mainTask = await mcp__task-manager__create_task({
    title: featureName,
    priority: "high",
    status: "in_progress"
  });
  
  // 2. Hook: pre-development
  // 自動執行 git pull, npm install
  
  // 3. Agent: 規劃
  await Task({
    subagent_type: "general-purpose",
    description: "規劃",
    prompt: `規劃 ${featureName} 的技術方案`
  });
  
  // 4. 開發實作
  // ... 編寫程式碼 ...
  
  // 5. Hook: post-code-change
  // 自動執行 lint 和格式化
  
  // 6. Agent: 測試生成
  await Task({
    subagent_type: "test-generator",
    description: "測試",
    prompt: "生成完整測試套件"
  });
  
  // 7. Command: 執行測試
  // /test
  
  // 8. Agent: 程式碼審查
  await Task({
    subagent_type: "code-reviewer",
    description: "審查",
    prompt: "審查程式碼品質"
  });
  
  // 9. Hook: pre-commit
  // 自動執行最終檢查
  
  // 10. MCP: 更新任務狀態
  await mcp__task-manager__update_task(mainTask.id, {
    updates: { status: "completed" }
  });
  
  // 11. Hook: post-task-complete
  // 自動生成報告和通知
  
  console.log(`✅ 功能開發完成: ${featureName}`);
}
```

### 設定檔範例（.claude/config.yml）

```yaml
# Claude Code 專案配置
project:
  name: "My Go API"
  type: "golang"
  
# Hooks 配置
hooks:
  pre-edit:
    - backup-file.sh
  post-edit:
    - format-code.sh
  post-tool-use:
    - command: "go fmt ./..."
      when: "*.go"
    - command: "npm run lint"
      when: "*.js"
  pre-commit:
    - run-tests.sh
    - check-coverage.sh
    
# Commands 配置
commands:
  /build: "go build -o bin/app"
  /test: "go test -v ./..."
  /lint: "golangci-lint run"
  /deploy: "./scripts/deploy.sh"
  /review: "trigger:code-reviewer"
  
# Agents 自動觸發規則
agents:
  test-generator:
    trigger:
      - on: "new_function"
      - on: "file_created:*_test.go"
  code-reviewer:
    trigger:
      - on: "pr_created"
      - on: "commit_count > 5"
  api-documenter:
    trigger:
      - on: "route_added"
      - on: "openapi_changed"
```

## 📈 效益對比

| 指標 | 傳統開發 | 使用框架 | 提升 |
|------|---------|---------|------|
| 新功能開發時間 | 4 小時 | 1 小時 | 75% ⬇️ |
| 測試撰寫時間 | 2 小時 | 10 分鐘 | 90% ⬇️ |
| 程式碼審查 | 1 小時 | 5 分鐘 | 92% ⬇️ |
| 文檔更新 | 30 分鐘 | 自動 | 100% ⬇️ |
| Bug 修復 | 2 小時 | 30 分鐘 | 75% ⬇️ |
| 任務追蹤 | 手動 | 自動 | ∞ |

## 🎯 總結

這套框架的本質是：

1. **CLAUDE.md** = 讓 AI 了解你的專案
2. **MCP** = 讓 AI 能執行實際操作
3. **Agents** = 讓 AI 分工合作
4. **自動化** = 讓 AI 主動完成工作流程

**結果**：你專注於創意和決策，AI 處理執行和細節。

## 🚀 開始使用

```bash
# 1. 設定框架（10 秒）
curl -sSL https://your-repo/setup-framework.sh | bash

# 2. 啟動 Claude Code
claude

# 3. 告訴 AI 你要做什麼
"幫我開發一個待辦事項 API"

# 4. AI 自動完成整個流程
```

---

**這不是取代開發者，而是增強開發者** - 讓你像有一個智能團隊一樣工作！

*Welcome to the future of AI-Assisted Development! 🚀*