# CLAUDE.md - Task Manager API

這個檔案為 Claude Code 提供專案特定的指引和上下文。

## 專案概述

這是一個展示 Claude Code 最佳實踐的任務管理 API 範例專案。請遵循以下指引來維護和擴展這個專案。

## 開發指引

### 程式碼風格
- 使用 ES6+ 語法和模組系統
- 遵循 Airbnb JavaScript 風格指南
- 所有非同步操作使用 async/await
- 適當使用 JSDoc 註解

### 錯誤處理
- 使用集中式錯誤處理中間件
- 驗證錯誤返回 400 狀態碼
- 資源未找到返回 404 狀態碼
- 伺服器錯誤返回 500 狀態碼

### 測試要求
- 新功能必須包含測試
- 測試覆蓋率保持在 80% 以上
- 使用 Node.js 內建測試框架
- 測試檔案放在 tests/ 目錄

## Claude Code 工作流程

### 1. 實作新功能時
```
1. 先使用 TodoWrite 工具規劃任務
2. 查看現有程式碼結構和模式
3. 實作功能
4. 【自動】使用 test-generator sub-agent 生成測試
5. 【自動】使用 code-reviewer sub-agent 審查程式碼
6. 【自動】運行 npm run lint 和 npm test
7. 【自動】如果有錯誤，立即修復並重新測試
```

### 2. 修復錯誤時
```
1. 重現錯誤並理解根本原因
2. 編寫失敗的測試案例
3. 修復錯誤使測試通過
4. 【自動】運行 npm test 確保其他測試仍然通過
5. 【自動】使用 code-reviewer sub-agent 審查修復
```

### 3. 重構程式碼時
```
1. 【自動】運行 npm test 確保有完整的測試覆蓋
2. 小步驟進行重構
3. 【自動】每步後運行測試
4. 保持 API 向後相容
5. 【自動】使用 api-documenter 更新文檔（如果 API 有變更）
```

## MCP-Agent 智能協作系統

### 🤖 Agent + MCP 自動化矩陣

| Agent | MCP 整合 | 自動觸發時機 | 協作流程 |
|-------|----------|-------------|----------|
| **task-manager-specialist** | `mcp__task-manager__*` | 每次開始新工作 | 創建任務 → 追蹤進度 → 更新狀態 |
| **code-reviewer** | `mcp__task-manager__update_task` | 完成功能後 | 審查 → 記錄問題 → 更新任務 |
| **test-generator** | `mcp__task-manager__create_task` | 新增功能時 | 生成測試 → 創建測試任務 |
| **api-documenter** | `mcp__task-manager__update_task` | API 變更後 | 更新文檔 → 標記任務完成 |
| **api-tester** | `mcp__task-manager__get_task_stats` | 測試完成後 | 執行測試 → 生成報告 |

### 🔄 智能工作流程 2.0（強化版）

#### 1. 新功能開發流程（全自動 + 智能判斷）
```yaml
觸發: 使用者要求新功能 或 /new 命令
智能判斷:
  - 分析功能複雜度（簡單/中等/複雜）
  - 判斷是否需要規格文件
  - 評估所需 Agent 組合
  
執行順序:
  1. 【智能分析】:
     if (複雜功能):
       - mcp__spec-workflow-mcp__specs-workflow(init)
       - Task(general-purpose): 撰寫規格
     
  2. 【MCP 任務創建】:
     - mcp__task-manager__create_task
     - 根據複雜度設定 priority (urgent/high/medium)
     - 自動添加相關 tags
     
  3. 【TodoWrite 同步】:
     - 分解成子任務
     - 設定依賴關係
     
  4. 【並行開發】: # 同時執行提升效率
     parallel:
       - 實作功能程式碼
       - Task(test-generator): 預先生成測試框架
       - Task(api-documenter): 準備文檔模板
     
  5. 【自動測試】:
     - Hook: post-edit 自動運行相關測試
     - 如果失敗: 自動修復或標記問題
     
  6. 【智能審查】:
     - Task(code-reviewer): 全面審查
     - 如果發現問題: 創建修復子任務
     
  7. 【完成驗證】:
     - 運行完整測試套件
     - 檢查覆蓋率 > 80%
     - mcp__task-manager__update_task(completed)
     
  8. 【自動報告】:
     - mcp__task-manager__get_task_stats
     - 生成 changelog
     - 更新 README 進度

#### 2. Bug 修復流程（全自動）
```yaml
觸發: 發現或報告 bug
執行順序:
  1. task-manager-specialist:
     - mcp__task-manager__create_task (priority: high, tag: bug)
  2. 分析問題:
     - grep/read 找出問題
  3. test-generator:
     - 先寫失敗的測試
  4. 修復 bug:
     - 實作修復
  5. api-tester:
     - 運行測試確認修復
     - mcp__task-manager__update_task (添加測試結果)
  6. code-reviewer:
     - 審查修復
  7. task-manager-specialist:
     - mcp__task-manager__update_task (status: completed)
```

#### 3. 進度查詢流程（全自動）
```yaml
觸發: 使用者詢問進度
執行順序:
  1. task-manager-specialist:
     - mcp__task-manager__list_tasks (status: in_progress)
     - mcp__task-manager__get_task_stats
  2. 生成報告:
     - 當前進行中的任務
     - 完成率統計
     - 優先級分布
```

### 🎯 Agent 自動觸發規則 2.0

#### task-manager-specialist（MCP 協調者）
- ✅ **開始任何工作前** → 創建追蹤任務
- ✅ **每完成一個步驟** → 更新任務進度
- ✅ **遇到阻礙時** → 更新任務狀態為 blocked
- ✅ **工作完成後** → 標記完成並生成統計

#### code-reviewer + MCP
- ✅ 完成功能 → **自動記錄審查結果到任務**
- ✅ 發現問題 → **創建新的修復任務**
- ✅ 通過審查 → **更新任務狀態**

#### test-generator + MCP
- ✅ 生成測試 → **創建測試覆蓋任務**
- ✅ 測試失敗 → **更新任務優先級為 urgent**
- ✅ 測試通過 → **記錄覆蓋率到任務**

#### api-documenter + MCP
- ✅ 更新文檔 → **標記文檔任務完成**
- ✅ 生成 OpenAPI → **創建 API 文檔任務**

#### database-optimizer + MCP
- ✅ 優化查詢 → **記錄效能改善到任務**
- ✅ 遷移資料 → **創建遷移追蹤任務**

#### api-tester + MCP
- ✅ 測試完成 → **更新任務測試結果**
- ✅ 發現問題 → **創建 bug 修復任務**

## MCP 自動化整合

### Task Manager MCP 自動使用場景

#### 1. 專案任務追蹤（自動觸發）
當執行以下操作時，自動使用 task-manager MCP：

- **新功能開發時：**
  ```
  自動創建任務：mcp__task-manager__create_task
  - title: "實作 [功能名稱]"
  - priority: 根據需求判斷 (urgent/high/medium/low)
  - status: "in_progress"
  - tags: ["feature", "development"]
  ```

- **修復 Bug 時：**
  ```
  自動創建任務：mcp__task-manager__create_task
  - title: "修復: [錯誤描述]"
  - priority: "high"
  - status: "in_progress"
  - tags: ["bug", "fix"]
  ```

- **完成功能後：**
  ```
  自動更新任務：mcp__task-manager__update_task
  - status: "completed"
  - 添加完成時間和測試結果
  ```

#### 2. 進度報告（自動生成）
- 每次使用者詢問進度時，自動調用 `mcp__task-manager__get_task_stats`
- 完成重要里程碑時，自動生成進度報告
- 使用 `mcp__task-manager__list_tasks` 顯示當前進行中的任務

#### 3. 任務管理整合流程
```javascript
// 自動化流程範例
1. 使用者提出需求
2. 【自動】創建對應任務 (create_task)
3. 【自動】更新 TodoWrite 同步任務狀態
4. 執行開發工作
5. 【自動】更新任務進度 (update_task)
6. 完成後【自動】標記完成 (update_task: status=completed)
7. 【自動】生成進度報告 (get_task_stats)
```

### 其他 MCP 服務器自動化

#### SQLite MCP（資料持久化）
- **自動觸發：** 當任務數量 > 100 時，建議遷移到 SQLite
- **自動執行：** 定期備份任務資料到資料庫
- **查詢優化：** 自動建立索引和優化查詢

#### GitHub MCP（問題追蹤）
- **自動觸發：** 發現需要長期追蹤的 bug
- **自動創建：** 將高優先級任務同步為 GitHub Issue
- **自動更新：** PR 合併後自動關閉相關 Issue

#### Slack MCP（團隊通知）
- **自動觸發：** 完成重要功能或修復關鍵 bug
- **自動通知：** 每日進度總結
- **警報通知：** 測試失敗或建構錯誤時

## 🪝 自動化 Hooks 配置

### Pre-hooks（執行前自動觸發）
```yaml
pre-edit:
  - 備份原始檔案
  - 檢查檔案權限
  
pre-commit:
  - npm run lint
  - npm test
  - npm run typecheck
  - 如果失敗，自動修復並重試
  
pre-push:
  - npm run build
  - npm run test:e2e
  - 檢查測試覆蓋率 > 80%
```

### Post-hooks（執行後自動觸發）
```yaml
post-edit:
  *.js, *.ts: npm run format
  *.md: 更新目錄結構
  *.json: 驗證 JSON 格式
  
post-tool-use:
  - 如果修改了 src/: npm run lint --fix
  - 如果修改了 tests/: npm test
  - 如果修改了 docs/: 觸發 api-documenter
  
post-task-complete:
  - mcp__task-manager__get_task_stats
  - 生成進度報告
  - 更新 README 狀態徽章
```

### 智能 Hook 規則
```javascript
// 檔案變更觸發
on_file_change: {
  "*.service.js": ["運行單元測試", "更新依賴注入"],
  "*.controller.js": ["更新 API 文檔", "運行整合測試"],
  "*.model.js": ["更新資料庫 schema", "運行遷移測試"],
  "package.json": ["npm install", "檢查安全漏洞"]
}

// 錯誤自動修復
on_error: {
  "ESLint error": "npm run lint --fix",
  "Test failed": "觸發 test-generator 修復測試",
  "Type error": "觸發 code-reviewer 檢查型別",
  "Build failed": "清理並重新建構"
}

## 💻 Claude Code Commands（快捷指令）

### 內建 Commands
```bash
/help           # 顯示幫助
/clear          # 清除對話
/status         # 專案狀態總覽
/tasks          # 列出所有任務
/progress       # 顯示進度報告
/test           # 執行測試套件
/lint           # 執行程式碼檢查
/build          # 建構專案
/commit [msg]   # 智能提交（自動生成訊息）
/deploy         # 部署到環境
```

### 專案特定 Commands
```bash
# 快速操作
/new [feature]  # 開始新功能開發（自動創建任務+規格）
/fix [bug]      # 開始修復 bug（創建高優先級任務）
/refactor       # 開始重構（先跑測試確保安全）
/review         # 觸發完整程式碼審查
/docs           # 更新所有文檔

# MCP 整合
/task create    # 創建新任務
/task list      # 列出任務
/task complete  # 完成當前任務
/stats          # 顯示任務統計

# Agent 觸發
/test-gen       # 觸發 test-generator
/review-code    # 觸發 code-reviewer
/optimize-db    # 觸發 database-optimizer
/update-api     # 觸發 api-documenter

# 批次操作
/check-all      # 執行所有檢查（lint + test + build）
/fix-all        # 修復所有問題（lint --fix + 格式化）
/update-all     # 更新所有（依賴 + 文檔 + 測試）
```

### Command 別名設定
```javascript
// 自訂快捷指令
aliases: {
  "/t": "/test",
  "/l": "/lint",
  "/b": "/build",
  "/c": "/commit",
  "/n": "/new",
  "/f": "/fix"
}
```

## 常用 npm 命令

```bash
# 開發
npm run dev

# 測試
npm test
npm run test:watch
npm run test:coverage

# 程式碼品質
npm run lint
npm run lint:fix
npm run format
npm run typecheck

# 建構
npm run build
npm run build:prod

# 綜合檢查
npm run pre-commit
npm run validate

## 性能考量

- 使用 Map 而非 Object 來存儲任務（更好的性能）
- 實作適當的分頁機制（當任務數量增長時）
- 考慮添加快取層（Redis MCP）

## 安全最佳實踐

- 始終驗證輸入（Zod schemas）
- 不要在日誌中記錄敏感資訊
- 使用環境變數管理密鑰
- 定期更新依賴項

## 未來擴展建議

1. 添加使用者認證和授權
2. 實作 WebSocket 即時更新
3. 添加任務附件功能
4. 實作任務模板系統
5. 添加批次操作 API
6. 整合更多外部服務

## 注意事項

- 這是教學範例，生產環境需要額外的安全和擴展性考量
- 目前使用記憶體存儲，生產環境應使用資料庫
- 需要添加速率限制和 API 金鑰管理

## 自動化執行規則

### 自動檢查點
1. **每次修改程式碼後自動執行：**
   - `npm run lint` - 檢查程式碼風格
   - `npm run typecheck` - 檢查型別（如果有 TypeScript）
   - 如果失敗，立即修復

2. **每次完成功能後自動執行：**
   - `npm test` - 運行所有測試
   - 觸發 test-generator 補充測試
   - 觸發 code-reviewer 審查程式碼

3. **每次 API 變更後自動執行：**
   - 觸發 api-documenter 更新文檔
   - 觸發 api-tester 驗證 endpoint

### Agent 自動決策流程 (MCP + Agent 協作版)
當使用者提出需求時，依照以下順序自動決定：

1. **分析需求類型：**
   - 🔧 **修復類** 
     ```
     【MCP】create_task(bug) → 【Agent】task-manager-specialist(協調) 
     → grep/read 找問題 → 修復 → 【MCP】update_task 
     → 【Agent】test-generator → 【Agent】code-reviewer 
     → 【MCP】complete_task
     ```
   
   - ✨ **新功能** 
     ```
     【判斷複雜度】
     if (複雜):
       【MCP】specs-workflow(init) → 【Agent】general-purpose(撰寫規格)
     【MCP】create_task(feature) → 【Agent】task-manager-specialist 
     → TodoWrite 規劃 → 實作 → 【MCP】update_task 
     → 【Agent】test-generator → 【Agent】api-documenter 
     → 【Agent】code-reviewer → 【MCP】complete_task
     ```
   
   - ♻️ **重構類** 
     ```
     【MCP】create_task(refactor) → 【Agent】database-optimizer(分析)
     → 先跑測試 → 重構 → 測試 
     → 【Agent】code-reviewer → 【MCP】complete_task
     ```
   
   - 📚 **文檔類** 
     ```
     【Agent】api-documenter → 【MCP】create_task(documentation)
     → 生成文檔 → 【MCP】complete_task
     ```
   
   - 🔍 **查詢類** 
     ```
     grep/glob 搜尋 → 【MCP】list_tasks → 【Agent】task-manager-specialist(報告)
     ```

2. **Context7 自動使用時機：**
   - 遇到不熟悉的函式庫或框架
   - 使用者詢問「如何使用 X」
   - 需要查詢最佳實踐或 API 文檔
   - 遇到錯誤需要查詢解決方案

3. **並行執行優化：**
   - 同時運行 lint、test、typecheck（使用多個 Bash tool）
   - 批次讀取相關檔案（使用多個 Read tool）
   - 同時觸發多個獨立的 sub-agent

### 失敗自動修復
- 如果 lint 失敗 → 自動運行 `npm run format` 並重新檢查
- 如果測試失敗 → 分析錯誤訊息並嘗試修復
- 如果建構失敗 → 檢查依賴並修復導入問題

---

## 🧠 智能自動化規則

### 自動判斷與執行
```javascript
// 智能需求分析
function analyzeRequest(userInput) {
  // 關鍵字匹配
  const patterns = {
    feature: /新增|功能|實作|開發|create|add|implement/i,
    bug: /錯誤|修復|bug|fix|issue|問題/i,
    refactor: /重構|優化|改善|refactor|optimize/i,
    docs: /文檔|文件|說明|document|readme/i,
    test: /測試|test|spec/i,
    deploy: /部署|發布|release|deploy/i
  };
  
  // 複雜度評估
  const complexity = {
    simple: userInput.length < 50,
    medium: userInput.length < 150,
    complex: userInput.length >= 150 || userInput.includes('系統')
  };
  
  return { type, complexity, autoActions };
}

// 自動執行決策
autoExecute: {
  "新功能": [
    "mcp__task-manager__create_task",
    "if(complex) => specs-workflow",
    "TodoWrite 分解任務",
    "parallel(test-generator, api-documenter)",
    "code-reviewer after complete"
  ],
  "Bug修復": [
    "mcp__task-manager__create_task(priority: urgent)",
    "寫失敗測試",
    "修復",
    "驗證所有測試",
    "code-reviewer"
  ],
  "效能問題": [
    "database-optimizer 分析",
    "執行基準測試",
    "優化",
    "對比測試結果"
  ]
}
```

### 智能 Agent 組合
```yaml
場景判斷:
  API開發:
    agents: [api-documenter, test-generator, api-tester]
    hooks: [post-route-add, pre-deploy]
    
  資料庫變更:
    agents: [database-optimizer, test-generator]
    hooks: [pre-migration, post-schema-change]
    
  前端整合:
    agents: [api-documenter, code-reviewer]
    hooks: [post-api-change, update-sdk]
    
  安全修復:
    agents: [code-quality-guardian, code-reviewer]
    priority: urgent
    hooks: [security-scan, penetration-test]
```

### 自動化觸發條件
```javascript
// 檔案模式觸發
triggers: {
  "CREATE src/**/*.service.js": {
    actions: [
      "創建對應的 .spec.js 測試檔",
      "Task(test-generator): 生成測試",
      "更新依賴注入容器"
    ]
  },
  "MODIFY src/routes/*.js": {
    actions: [
      "Task(api-documenter): 更新 OpenAPI",
      "Task(api-tester): 驗證端點",
      "更新 Postman collection"
    ]
  },
  "DELETE src/**/*": {
    actions: [
      "檢查依賴關係",
      "更新 import 語句",
      "運行測試確保無破壞"
    ]
  }
}

// 錯誤模式觸發
errorPatterns: {
  "Cannot find module": {
    action: "npm install && npm run build"
  },
  "Test failed": {
    action: "分析失敗原因 -> 自動修復 -> 重新測試"
  },
  "Lint error": {
    action: "npm run lint:fix -> 如果仍失敗則觸發 code-reviewer"
  },
  "Type error": {
    action: "npm run typecheck -> 修復型別定義"
  }
}
```

### 進階自動化流程
```javascript
// 每日自動化例程
dailyRoutine: async () => {
  // 早上 9:00
  await mcp__task-manager__get_task_stats();
  await checkDependencyUpdates();
  
  // 每 2 小時
  await runTestSuite();
  await checkCodeCoverage();
  
  // 下班前
  await generateDailyReport();
  await backupImportantData();
}

// 智能決策樹
decisionTree: {
  if: "使用者說'部署'",
  then: [
    "檢查所有測試",
    "檢查覆蓋率 > 80%",
    "建構生產版本",
    "運行 E2E 測試",
    "if(success) => 執行部署",
    "else => 標記問題並通知"
  ]
}
```

*記住：始終優先考慮程式碼品質、測試覆蓋和文檔完整性。*

**核心原則：**
- 🤖 主動執行檢查，不等使用者要求
- ⚡ 平行處理提升效率
- 🔧 失敗立即修復，不累積技術債
- ✅ 每個操作都要有對應的測試和文檔
- 🧠 智能判斷需求，自動選擇最佳流程
- 🔄 持續優化，從錯誤中學習

## MCP Task Manager 快速指令

### 立即可用的 MCP 指令（無需設定）
```bash
# 創建任務
mcp__task-manager__create_task(title="任務名稱", priority="high", tags=["feature"])

# 列出所有任務
mcp__task-manager__list_tasks()

# 查看特定任務
mcp__task-manager__get_task(id="task-uuid")

# 更新任務狀態
mcp__task-manager__update_task(id="task-uuid", updates={status: "completed"})

# 刪除任務
mcp__task-manager__delete_task(id="task-uuid")

# 查看統計資料
mcp__task-manager__get_task_stats()
```

### 自動化範例腳本
```javascript
// 每次開始工作時自動執行
async function startWork(featureName) {
  // 1. 創建任務
  const task = await mcp__task-manager__create_task({
    title: featureName,
    status: "in_progress",
    priority: "medium"
  });
  
  // 2. 同步到 TodoWrite
  await TodoWrite([
    { content: featureName, status: "in_progress" }
  ]);
  
  // 3. 定期更新進度
  setInterval(() => {
    mcp__task-manager__update_task(task.id, {
      updates: { description: "進度更新..." }
    });
  }, 30 * 60 * 1000); // 每 30 分鐘
}

// 完成工作時
async function completeWork(taskId) {
  await mcp__task-manager__update_task(taskId, {
    updates: { status: "completed" }
  });
  await mcp__task-manager__get_task_stats(); // 顯示統計
}
```

## 📋 規格文件與實作計畫整合

### specs-workflow MCP 自動化

#### 1. 規格撰寫流程（全自動）
```yaml
觸發: 使用者要求新功能或計畫
執行順序:
  1. 初始化規格工作流:
     - mcp__spec-workflow-mcp__specs-workflow (action: init)
     - 設定 featureName 和 introduction
  2. task-manager-specialist:
     - mcp__task-manager__create_task (title: "規格: [功能名稱]")
     - 設定 tag: ["spec", "planning"]
  3. 執行規格撰寫:
     - 使用 Agent 分析需求
     - 自動生成規格文件
  4. 檢查狀態:
     - mcp__spec-workflow-mcp__specs-workflow (action: check)
  5. 確認規格:
     - mcp__spec-workflow-mcp__specs-workflow (action: confirm)
  6. 完成任務:
     - mcp__spec-workflow-mcp__specs-workflow (action: complete_task)
     - mcp__task-manager__update_task (status: completed)
```

#### 2. 實作計畫流程（全自動）
```yaml
觸發: 規格確認後
執行順序:
  1. 解析規格任務:
     - 從規格文件提取任務清單
  2. 批次創建任務:
     - 對每個實作項目:
       - mcp__task-manager__create_task
       - 設定依賴關係和優先級
  3. 生成實作計畫:
     - 使用 task-manager-specialist 協調
     - 建立時程表和里程碑
  4. 追蹤進度:
     - 定期調用 mcp__task-manager__get_task_stats
     - 自動更新規格工作流狀態
```

### 🎯 智能決策規則 3.0

#### 需求分析階段
```javascript
if (需求複雜度 > 簡單) {
  // 1. 先寫規格
  await mcp__spec-workflow-mcp__specs-workflow({
    action: "init",
    path: "/specs/[feature-name]",
    featureName: "[功能名稱]",
    introduction: "[功能簡介]"
  });
  
  // 2. 創建規格任務
  await mcp__task-manager__create_task({
    title: "撰寫規格: [功能名稱]",
    priority: "high",
    tags: ["spec", "planning"]
  });
  
  // 3. 觸發 Agent 協作
  await Task({
    subagent_type: "general-purpose",
    description: "分析需求並撰寫規格",
    prompt: "根據需求撰寫詳細規格..."
  });
}
```

#### 實作階段
```javascript
// 從規格自動生成任務
const specs = await mcp__spec-workflow-mcp__specs-workflow({
  action: "check",
  path: "/specs/[feature-name]"
});

// 解析並創建實作任務
for (const task of specs.tasks) {
  await mcp__task-manager__create_task({
    title: task.name,
    description: task.description,
    priority: task.priority || "medium",
    tags: ["implementation", specs.featureName]
  });
}

// 並行觸發多個 Agent
await Promise.all([
  Task({ subagent_type: "test-generator", ... }),
  Task({ subagent_type: "api-documenter", ... }),
  Task({ subagent_type: "code-quality-guardian", ... })
]);
```

### 🔄 完整自動化範例

#### 範例：實作使用者認證系統
```yaml
自動執行流程:
  1. 規格階段:
     - mcp__spec-workflow-mcp__specs-workflow (init: "user-auth")
     - mcp__task-manager__create_task (規格任務)
     - Agent: general-purpose (撰寫規格)
     
  2. 計畫階段:
     - 解析規格生成任務清單
     - 批次創建實作任務 (登入、註冊、JWT、權限)
     - 設定任務依賴和優先級
     
  3. 實作階段:
     - task-manager-specialist: 協調任務執行
     - test-generator: 為每個功能生成測試
     - api-documenter: 同步更新 API 文檔
     - code-reviewer: 即時審查程式碼
     
  4. 完成階段:
     - mcp__spec-workflow-mcp__specs-workflow (complete_task)
     - mcp__task-manager__get_task_stats (生成報告)
     - api-tester: 執行完整測試套件
```

### 📊 自動化監控面板

```javascript
// 即時監控所有進行中的工作
async function autoMonitor() {
  // 1. 檢查規格工作流狀態
  const specStatus = await mcp__spec-workflow-mcp__specs-workflow({
    action: "check"
  });
  
  // 2. 獲取任務統計
  const taskStats = await mcp__task-manager__get_task_stats();
  
  // 3. 生成綜合報告
  console.log(`
    📋 規格進度: ${specStatus.progress}
    ✅ 完成任務: ${taskStats.completed}
    🔄 進行中: ${taskStats.in_progress}
    📌 待處理: ${taskStats.pending}
    🎯 完成率: ${taskStats.completion_rate}%
  `);
  
  // 4. 智能決策下一步
  if (taskStats.blocked > 0) {
    // 自動觸發 problem-solver agent
    await Task({
      subagent_type: "general-purpose",
      description: "解決阻塞問題"
    });
  }
}
```