# 🚀 Claude Code 自動化框架使用指南

這份指南將幫助你在新專案或現有專案中快速導入 Claude Code 自動化框架，實現高效的 AI 輔助開發。

## 📋 目錄

1. [快速開始](#快速開始)
2. [新專案設定](#新專案設定)
3. [現有專案整合](#現有專案整合)
4. [核心功能使用](#核心功能使用)
5. [實戰範例](#實戰範例)
6. [最佳實踐](#最佳實踐)
7. [疑難排解](#疑難排解)

---

## 快速開始

### 🎯 10 秒快速部署（推薦）

```bash
# 方法 1: 使用 Shell 腳本（最快）
curl -sSL https://raw.githubusercontent.com/your-repo/setup-framework.sh | bash

# 方法 2: 使用 Node.js 腳本
npx claude-framework-setup

# 方法 3: 手動執行腳本
./setup-framework.sh [你的專案路徑]
```

### 🚀 專案快速初始化

```bash
# 1. 在你的專案目錄執行
cd your-project

# 2. 執行設定腳本
bash <(curl -s https://raw.githubusercontent.com/your-repo/setup-framework.sh)

# 3. 啟動 Claude Code
claude

# 4. 在 Claude Code 中初始化
node claude-init.js
```

### 📝 必要檔案清單

```
your-project/
├── CLAUDE.md           # Claude Code 專案指引（必須）
├── mcp-config.json     # MCP 服務器配置（可選）
├── .claudeignore       # 忽略檔案配置（可選）
└── scripts/
    └── register-mcp.sh # MCP 註冊腳本（可選）
```

---

## 新專案設定

### Step 1: 建立專案結構

```bash
# 建立新專案
mkdir my-awesome-project
cd my-awesome-project

# 初始化專案
npm init -y
git init
```

### Step 2: 建立 CLAUDE.md

創建 `CLAUDE.md` 檔案，使用以下模板：

```markdown
# CLAUDE.md - [你的專案名稱]

## 專案概述
[簡述專案目的和主要功能]

## 技術棧
- 語言: [JavaScript/TypeScript/Python/etc]
- 框架: [Express/React/Vue/etc]
- 資料庫: [MongoDB/PostgreSQL/SQLite/etc]

## 開發指引
### 程式碼風格
- [你的程式碼規範]

### 錯誤處理
- [錯誤處理策略]

### 測試要求
- [測試覆蓋要求]

## Claude Code 工作流程
[複製自動化工作流程章節]

## MCP-Agent 智能協作系統
[複製 MCP-Agent 協作設定]

## 自動化執行規則
[複製自動化規則]

## 專案特定指令
- 開發: npm run dev
- 測試: npm test
- 建構: npm run build
```

### Step 3: 設定 MCP（可選但建議）

```bash
# 安裝 MCP SDK
npm install @modelcontextprotocol/sdk

# 建立 MCP 服務器
cat > src/mcp-server.js << 'EOF'
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  { name: 'my-project-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// 加入你的專案特定工具
// ...

const transport = new StdioServerTransport();
await server.connect(transport);
EOF

# 建立配置
cat > mcp-config.json << 'EOF'
{
  "mcpServers": {
    "my-project": {
      "command": "node",
      "args": ["src/mcp-server.js"],
      "scope": "project"
    }
  }
}
EOF
```

### Step 4: 註冊 MCP 服務器

```bash
# 建立註冊腳本
cat > scripts/register-mcp.sh << 'EOF'
#!/bin/bash
echo "註冊 MCP 服務器..."
claude mcp add my-project -s project -- node src/mcp-server.js
echo "✅ MCP 服務器註冊完成"
EOF

chmod +x scripts/register-mcp.sh
./scripts/register-mcp.sh
```

### Step 5: 初始化專案任務

在 Claude Code 中執行：

```javascript
// 創建初始專案任務
await mcp__task-manager__create_task({
  title: "專案初始化",
  description: "設定開發環境和基礎架構",
  priority: "high",
  tags: ["setup", "infrastructure"]
});

// 如果是複雜專案，初始化規格工作流
await mcp__spec-workflow-mcp__specs-workflow({
  action: "init",
  path: "/specs/project-overview",
  featureName: "專案架構",
  introduction: "定義專案的整體架構和核心功能"
});
```

---

## 現有專案整合

### Step 1: 分析現有專案

```bash
# 在專案根目錄執行
tree -L 2 -I 'node_modules|.git' > project-structure.txt

# 分析技術棧
grep -E '"dependencies"|"devDependencies"' package.json -A 20
```

### Step 2: 建立客製化 CLAUDE.md

根據現有專案特性調整 CLAUDE.md：

```markdown
# CLAUDE.md - [現有專案名稱]

## 專案現況
- 建立時間: [日期]
- 主要功能: [列出現有功能]
- 技術債: [已知問題]

## 現有架構
[描述現有的檔案結構和架構模式]

## 整合策略
1. 保持現有功能正常運作
2. 漸進式導入自動化
3. 優先處理高頻操作

## 遷移計畫
- 第一階段: 導入 MCP 任務管理
- 第二階段: 整合自動化測試
- 第三階段: 完整 Agent 協作

[其餘章節同新專案模板]
```

### Step 3: 漸進式整合

```javascript
// 階段 1: 基礎任務管理
// 為現有功能創建任務追蹤
const existingFeatures = [
  "使用者認證",
  "資料 CRUD",
  "API 端點"
];

for (const feature of existingFeatures) {
  await mcp__task-manager__create_task({
    title: `維護: ${feature}`,
    status: "completed",
    tags: ["existing", "maintenance"]
  });
}

// 階段 2: 識別改進項目
await Task({
  subagent_type: "code-reviewer",
  description: "審查現有程式碼",
  prompt: "分析程式碼品質並提出改進建議"
});

// 階段 3: 建立改進任務
await mcp__task-manager__create_task({
  title: "程式碼重構計畫",
  priority: "medium",
  tags: ["refactor", "improvement"]
});
```

### Step 4: 設定自動化 Hooks

```json
// 在 package.json 加入
{
  "scripts": {
    "pre-commit": "npm run lint && npm test",
    "post-merge": "npm install && npm run build",
    "claude:setup": "node scripts/setup-claude.js"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run pre-commit"
    }
  }
}
```

---

## 核心功能使用

### 🤖 1. Agent 協作

```javascript
// 範例：開發新功能的完整流程
async function developFeature(featureName) {
  // 1. 初始化規格（複雜功能）
  if (isComplex(featureName)) {
    await mcp__spec-workflow-mcp__specs-workflow({
      action: "init",
      path: `/specs/${featureName}`,
      featureName: featureName,
      introduction: "功能描述..."
    });
  }
  
  // 2. 創建主任務
  const mainTask = await mcp__task-manager__create_task({
    title: `實作: ${featureName}`,
    priority: "high",
    status: "in_progress"
  });
  
  // 3. 並行觸發 Agents
  await Promise.all([
    Task({
      subagent_type: "test-generator",
      description: "生成測試",
      prompt: `為 ${featureName} 生成完整測試套件`
    }),
    Task({
      subagent_type: "api-documenter",
      description: "準備文檔",
      prompt: `準備 ${featureName} 的 API 文檔模板`
    })
  ]);
  
  // 4. 實作功能
  // ... 你的程式碼 ...
  
  // 5. 審查和完成
  await Task({
    subagent_type: "code-reviewer",
    description: "審查程式碼",
    prompt: "審查新功能的實作"
  });
  
  // 6. 更新任務狀態
  await mcp__task-manager__update_task(mainTask.id, {
    updates: { status: "completed" }
  });
  
  // 7. 生成報告
  await mcp__task-manager__get_task_stats();
}
```

### 📊 2. 進度追蹤

```javascript
// 每日站立會議報告
async function dailyStandup() {
  // 昨天完成
  const completed = await mcp__task-manager__list_tasks({
    status: "completed",
    // 過濾昨天的任務
  });
  
  // 今天進行
  const inProgress = await mcp__task-manager__list_tasks({
    status: "in_progress"
  });
  
  // 阻礙項目
  const blocked = await mcp__task-manager__list_tasks({
    tag: "blocked"
  });
  
  console.log(`
    📅 每日站立會議報告
    ✅ 昨日完成: ${completed.length} 項
    🔄 今日進行: ${inProgress.length} 項
    ⚠️ 阻礙項目: ${blocked.length} 項
  `);
}
```

### 🐛 3. Bug 修復流程

```javascript
// 自動化 Bug 修復
async function fixBug(bugDescription) {
  // 1. 創建 Bug 任務
  const bugTask = await mcp__task-manager__create_task({
    title: `BUG: ${bugDescription}`,
    priority: "urgent",
    tags: ["bug", "critical"]
  });
  
  // 2. 分析問題
  await Task({
    subagent_type: "general-purpose",
    description: "分析 Bug",
    prompt: `分析以下 Bug: ${bugDescription}`
  });
  
  // 3. 寫測試（TDD）
  await Task({
    subagent_type: "test-generator",
    description: "生成失敗測試",
    prompt: "為 Bug 寫一個會失敗的測試"
  });
  
  // 4. 修復
  // ... 修復程式碼 ...
  
  // 5. 驗證
  await Bash({ command: "npm test" });
  
  // 6. 完成
  await mcp__task-manager__update_task(bugTask.id, {
    updates: { 
      status: "completed",
      description: "Bug 已修復並通過測試"
    }
  });
}
```

---

## 實戰範例

### 範例 1: RESTful API 開發

```javascript
// 完整的 API 開發流程
async function createRESTfulAPI(resourceName) {
  // 1. 規格定義
  await mcp__spec-workflow-mcp__specs-workflow({
    action: "init",
    path: `/specs/api-${resourceName}`,
    featureName: `${resourceName} API`,
    introduction: `RESTful API for ${resourceName}`
  });
  
  // 2. 創建任務清單
  const endpoints = ['GET', 'POST', 'PUT', 'DELETE'];
  const tasks = [];
  
  for (const method of endpoints) {
    const task = await mcp__task-manager__create_task({
      title: `實作 ${method} /${resourceName}`,
      priority: "medium",
      tags: ["api", resourceName, method.toLowerCase()]
    });
    tasks.push(task);
  }
  
  // 3. 實作每個端點
  for (const task of tasks) {
    // 更新狀態
    await mcp__task-manager__update_task(task.id, {
      updates: { status: "in_progress" }
    });
    
    // 生成測試
    await Task({
      subagent_type: "test-generator",
      description: `測試 ${task.title}`,
      prompt: `生成 ${task.title} 的測試案例`
    });
    
    // 實作端點
    // ... 你的實作 ...
    
    // 更新文檔
    await Task({
      subagent_type: "api-documenter",
      description: "更新 API 文檔",
      prompt: `更新 ${task.title} 的文檔`
    });
    
    // 完成任務
    await mcp__task-manager__update_task(task.id, {
      updates: { status: "completed" }
    });
  }
  
  // 4. 整合測試
  await Task({
    subagent_type: "api-tester",
    description: "API 整合測試",
    prompt: `執行 ${resourceName} API 的完整測試`
  });
  
  // 5. 生成最終報告
  await mcp__task-manager__get_task_stats();
}

// 使用範例
await createRESTfulAPI("users");
await createRESTfulAPI("products");
```

### 範例 2: 資料庫遷移

```javascript
// 從記憶體遷移到 SQLite
async function migrateToDatabase() {
  // 1. 創建遷移計畫
  await mcp__spec-workflow-mcp__specs-workflow({
    action: "init",
    path: "/specs/database-migration",
    featureName: "資料庫遷移",
    introduction: "從記憶體存儲遷移到 SQLite"
  });
  
  // 2. 分析現有資料結構
  await Task({
    subagent_type: "database-optimizer",
    description: "分析資料結構",
    prompt: "分析現有的記憶體資料結構並設計資料庫 schema"
  });
  
  // 3. 創建遷移任務
  const migrationSteps = [
    "設計資料庫 Schema",
    "建立資料庫連接",
    "實作資料存取層 (DAL)",
    "遷移現有資料",
    "更新 API 端點",
    "測試資料完整性"
  ];
  
  for (const step of migrationSteps) {
    await mcp__task-manager__create_task({
      title: step,
      priority: "high",
      tags: ["migration", "database"]
    });
  }
  
  // 4. 執行遷移
  // ... 遷移程式碼 ...
  
  // 5. 驗證
  await Task({
    subagent_type: "api-tester",
    description: "驗證遷移",
    prompt: "測試所有 API 端點確保資料庫遷移成功"
  });
}
```

### 範例 3: 效能優化

```javascript
// 自動化效能優化流程
async function optimizePerformance() {
  // 1. 效能分析
  const perfTask = await mcp__task-manager__create_task({
    title: "效能優化",
    priority: "medium",
    tags: ["performance", "optimization"]
  });
  
  // 2. 執行基準測試
  await Bash({ 
    command: "npm run benchmark",
    description: "執行效能基準測試"
  });
  
  // 3. 分析瓶頸
  await Task({
    subagent_type: "database-optimizer",
    description: "分析效能瓶頸",
    prompt: "分析查詢效能和資料庫索引"
  });
  
  // 4. 實施優化
  const optimizations = [
    "添加資料庫索引",
    "實作快取層",
    "優化查詢語句",
    "減少 N+1 查詢"
  ];
  
  for (const opt of optimizations) {
    await mcp__task-manager__create_task({
      title: opt,
      priority: "medium",
      tags: ["performance", "subtask"]
    });
  }
  
  // 5. 驗證改進
  await Bash({ 
    command: "npm run benchmark",
    description: "驗證效能改進"
  });
  
  // 6. 更新任務
  await mcp__task-manager__update_task(perfTask.id, {
    updates: { 
      status: "completed",
      description: "效能優化完成，回應時間改善 50%"
    }
  });
}
```

---

## 最佳實踐

### ✅ DO - 建議做法

1. **始終使用 CLAUDE.md**
   - 每個專案都應該有客製化的 CLAUDE.md
   - 定期更新以反映專案變化

2. **任務優先級管理**
   ```javascript
   // 正確：明確的優先級
   await mcp__task-manager__create_task({
     title: "關鍵安全修復",
     priority: "urgent",
     tags: ["security", "critical"]
   });
   ```

3. **並行執行提升效率**
   ```javascript
   // 正確：並行觸發多個 Agent
   await Promise.all([
     Task({ subagent_type: "test-generator", ... }),
     Task({ subagent_type: "api-documenter", ... }),
     Task({ subagent_type: "code-reviewer", ... })
   ]);
   ```

4. **規格先行（複雜功能）**
   ```javascript
   // 正確：複雜功能先寫規格
   if (featureComplexity > SIMPLE) {
     await mcp__spec-workflow-mcp__specs-workflow({
       action: "init",
       ...
     });
   }
   ```

### ❌ DON'T - 避免做法

1. **避免跳過任務追蹤**
   ```javascript
   // 錯誤：直接實作不追蹤
   function implementFeature() {
     // 直接寫程式碼...
   }
   
   // 正確：先創建任務
   async function implementFeature() {
     const task = await mcp__task-manager__create_task(...);
     // 實作...
     await mcp__task-manager__update_task(...);
   }
   ```

2. **避免串行執行獨立任務**
   ```javascript
   // 錯誤：串行執行
   await Task({ subagent_type: "test-generator", ... });
   await Task({ subagent_type: "api-documenter", ... });
   
   // 正確：並行執行
   await Promise.all([...]);
   ```

3. **避免忽略測試**
   ```javascript
   // 錯誤：跳過測試
   // 實作功能後直接標記完成
   
   // 正確：確保測試通過
   await Bash({ command: "npm test" });
   if (testsPassed) {
     await mcp__task-manager__update_task(...);
   }
   ```

---

## 疑難排解

### 常見問題

#### Q1: MCP 服務器無法啟動
```bash
# 檢查 MCP 配置
cat mcp-config.json

# 驗證服務器檔案
node src/mcp-server.js

# 重新註冊
claude mcp remove my-project
claude mcp add my-project -s project -- node src/mcp-server.js
```

#### Q2: Agent 沒有自動觸發
```javascript
// 檢查 CLAUDE.md 是否正確配置
// 確保有明確的觸發條件

// 手動觸發測試
await Task({
  subagent_type: "code-reviewer",
  description: "測試 Agent",
  prompt: "審查最近的程式碼變更"
});
```

#### Q3: 任務狀態不同步
```javascript
// 重新同步任務狀態
const tasks = await mcp__task-manager__list_tasks();
for (const task of tasks) {
  // 檢查實際狀態並更新
  await mcp__task-manager__update_task(task.id, {
    updates: { status: getActualStatus(task) }
  });
}
```

### 🔧 調試技巧

1. **啟用詳細日誌**
   ```bash
   export DEBUG=mcp:*
   claude --verbose
   ```

2. **檢查 Agent 輸出**
   ```javascript
   const result = await Task({
     subagent_type: "general-purpose",
     description: "調試",
     prompt: "顯示詳細的執行步驟"
   });
   console.log(result);
   ```

3. **驗證 MCP 連接**
   ```javascript
   // 測試 MCP 連接
   try {
     await mcp__task-manager__get_task_stats();
     console.log("✅ MCP 連接正常");
   } catch (error) {
     console.error("❌ MCP 連接失敗:", error);
   }
   ```

---

## 進階技巧

### 自定義 Agent 工作流

```javascript
// 建立專案特定的 Agent 工作流
class CustomWorkflow {
  async deploymentPipeline() {
    // 1. 運行測試
    await this.runTests();
    
    // 2. 建構專案
    await this.build();
    
    // 3. 部署前檢查
    await Task({
      subagent_type: "api-tester",
      description: "部署前測試",
      prompt: "執行完整的 API 測試套件"
    });
    
    // 4. 部署
    await this.deploy();
    
    // 5. 部署後驗證
    await this.postDeploymentCheck();
    
    // 6. 更新任務
    await mcp__task-manager__create_task({
      title: `部署完成: ${new Date().toISOString()}`,
      status: "completed",
      tags: ["deployment", "production"]
    });
  }
}
```

### 整合外部服務

```javascript
// 整合 GitHub
await Task({
  subagent_type: "general-purpose",
  description: "GitHub 整合",
  prompt: `
    使用 GitHub MCP 創建 Issue：
    - 標題: ${bugTitle}
    - 標籤: bug, high-priority
    - 指派給: @team-lead
  `
});

// 整合 Slack
await Task({
  subagent_type: "general-purpose",
  description: "Slack 通知",
  prompt: `
    使用 Slack MCP 發送通知：
    - 頻道: #dev-team
    - 訊息: 新版本已部署到生產環境
  `
});
```

---

## 📚 相關資源

- [Claude Code 官方文檔](https://docs.anthropic.com/claude-code)
- [MCP SDK 文檔](https://modelcontextprotocol.com)
- [專案範例儲存庫](https://github.com/your-repo/examples)
- [社群討論區](https://community.claude.ai)

---

## 🤝 貢獻指南

歡迎貢獻改進建議！請遵循以下步驟：

1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 推送到分支
5. 開啟 Pull Request

---

## 📄 授權

本框架採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

---

*最後更新: 2024-12*
*版本: 1.0.0*