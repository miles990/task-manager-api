# ⚡ Claude Code 框架快速開始手冊

## 🎯 5 分鐘快速上手

### 新專案 - 複製貼上即可使用

```bash
# 1. 建立專案
mkdir my-project && cd my-project
npm init -y

# 2. 下載 CLAUDE.md 模板
curl -O https://raw.githubusercontent.com/your-repo/task-manager-api/main/CLAUDE.md

# 3. 啟動 Claude Code
claude

# 4. 在 Claude Code 中執行（初始化）
```

```javascript
// 貼上這段到 Claude Code
await mcp__task-manager__create_task({
  title: "專案初始化",
  priority: "high",
  status: "in_progress"
});

console.log("✅ 專案已初始化！");
```

### 現有專案 - 30 秒整合

```bash
# 1. 在專案根目錄
cd your-existing-project

# 2. 建立 CLAUDE.md
cat > CLAUDE.md << 'EOF'
# CLAUDE.md - 專案自動化配置

## 專案資訊
- 名稱: 我的專案
- 語言: JavaScript/TypeScript
- 框架: Express/React/Vue

## 自動化規則
1. 每次修改後自動執行: npm test
2. 新功能自動生成測試
3. 完成後自動審查程式碼

## 常用指令
- 開發: npm run dev
- 測試: npm test
- 建構: npm run build
EOF

# 3. 開始使用
claude
```

---

## 🚀 常用指令速查表

### 任務管理指令

```javascript
// 創建任務
await mcp__task-manager__create_task({
  title: "任務名稱",
  priority: "high"  // urgent/high/medium/low
});

// 查看所有任務
await mcp__task-manager__list_tasks();

// 查看進度統計
await mcp__task-manager__get_task_stats();

// 更新任務狀態
await mcp__task-manager__update_task("task-id", {
  updates: { status: "completed" }
});
```

### Agent 快速調用

```javascript
// 生成測試
await Task({
  subagent_type: "test-generator",
  description: "生成測試",
  prompt: "為當前功能生成測試"
});

// 審查程式碼
await Task({
  subagent_type: "code-reviewer",
  description: "審查程式碼",
  prompt: "審查最近的變更"
});

// 更新文檔
await Task({
  subagent_type: "api-documenter",
  description: "更新文檔",
  prompt: "更新 API 文檔"
});
```

### 規格工作流（複雜功能）

```javascript
// 初始化規格
await mcp__spec-workflow-mcp__specs-workflow({
  action: "init",
  path: "/specs/my-feature",
  featureName: "新功能",
  introduction: "功能描述"
});

// 檢查狀態
await mcp__spec-workflow-mcp__specs-workflow({
  action: "check",
  path: "/specs/my-feature"
});
```

---

## 📋 典型工作流程

### 1️⃣ 開發新功能

```javascript
// 複製這段程式碼到 Claude Code
async function 開發新功能() {
  // 1. 創建任務
  const task = await mcp__task-manager__create_task({
    title: "實作使用者登入功能",
    priority: "high",
    status: "in_progress"
  });
  
  // 2. 生成測試
  await Task({
    subagent_type: "test-generator",
    description: "生成測試",
    prompt: "生成使用者登入的測試案例"
  });
  
  // 3. 實作功能（你寫程式碼）
  console.log("📝 請實作功能...");
  
  // 4. 審查程式碼
  await Task({
    subagent_type: "code-reviewer",
    description: "審查",
    prompt: "審查登入功能的實作"
  });
  
  // 5. 完成任務
  await mcp__task-manager__update_task(task.id, {
    updates: { status: "completed" }
  });
  
  // 6. 查看統計
  await mcp__task-manager__get_task_stats();
}

// 執行
await 開發新功能();
```

### 2️⃣ 修復 Bug

```javascript
// 快速 Bug 修復流程
async function 修復Bug(描述) {
  // 創建 Bug 任務
  const bug = await mcp__task-manager__create_task({
    title: `BUG: ${描述}`,
    priority: "urgent",
    tags: ["bug"]
  });
  
  // 分析和修復
  console.log("🔍 分析問題...");
  console.log("🔧 修復中...");
  
  // 運行測試
  await Bash({ command: "npm test" });
  
  // 完成
  await mcp__task-manager__update_task(bug.id, {
    updates: { status: "completed" }
  });
  
  console.log("✅ Bug 已修復！");
}

// 使用
await 修復Bug("登入按鈕無法點擊");
```

### 3️⃣ 每日進度報告

```javascript
// 生成每日報告
async function 每日報告() {
  // 獲取統計
  const stats = await mcp__task-manager__get_task_stats();
  
  // 進行中的任務
  const inProgress = await mcp__task-manager__list_tasks({
    status: "in_progress"
  });
  
  // 顯示報告
  console.log(`
    📊 今日進度報告
    ================
    ✅ 已完成: ${stats.completed} 項
    🔄 進行中: ${inProgress.length} 項
    📌 待處理: ${stats.pending} 項
    🎯 完成率: ${stats.completionRate}%
  `);
}

// 執行
await 每日報告();
```

---

## 🛠️ 專案設定範本

### JavaScript/Node.js 專案

```markdown
# CLAUDE.md

## 專案設定
- 語言: JavaScript (ES6+)
- 執行環境: Node.js 18+
- 套件管理: npm

## 開發流程
1. 新功能 → 先寫測試 → 實作 → 審查
2. Bug 修復 → 重現問題 → 修復 → 驗證
3. 每次 commit 前運行 `npm test`

## 自動化 Agent
- test-generator: 所有新功能
- code-reviewer: 超過 50 行變更
- api-documenter: API 變更

## 指令
- npm run dev    # 開發
- npm test       # 測試
- npm run lint   # 檢查
```

### TypeScript 專案

```markdown
# CLAUDE.md

## 專案設定
- 語言: TypeScript 5.0+
- 建構工具: tsc / esbuild
- 型別檢查: 嚴格模式

## 開發流程
1. 定義介面 → 實作 → 型別檢查
2. 使用 `npm run typecheck` 驗證

## 自動化規則
- 每次修改後: npm run typecheck
- 建構前: npm run lint && npm test
```

### Python 專案

```markdown
# CLAUDE.md

## 專案設定
- 語言: Python 3.11+
- 套件管理: pip / poetry
- 測試框架: pytest

## 開發流程
1. 虛擬環境: python -m venv venv
2. 安裝依賴: pip install -r requirements.txt
3. 測試: pytest

## 自動化規則
- 程式碼風格: black + flake8
- 型別檢查: mypy
```

---

## ❓ 常見問題快速解答

### Q: 如何開始一個全新專案？
```bash
# 最簡單的方法
mkdir my-app && cd my-app
echo '# CLAUDE.md\n## 我的專案' > CLAUDE.md
claude
```

### Q: 如何在現有專案加入自動化？
```javascript
// 在 Claude Code 中執行
// 1. 分析專案
await Bash({ command: "ls -la" });

// 2. 創建初始任務
await mcp__task-manager__create_task({
  title: "整合自動化框架",
  priority: "high"
});

// 3. 開始使用
```

### Q: Agent 沒有自動觸發怎麼辦？
```javascript
// 手動觸發 Agent
await Task({
  subagent_type: "code-reviewer",
  description: "手動審查",
  prompt: "審查 src/ 目錄的程式碼"
});
```

### Q: 如何查看所有可用的 MCP 指令？
```javascript
// 任務管理
mcp__task-manager__create_task()
mcp__task-manager__list_tasks()
mcp__task-manager__update_task()
mcp__task-manager__delete_task()
mcp__task-manager__get_task_stats()

// 規格工作流
mcp__spec-workflow-mcp__specs-workflow()
```

---

## 🎓 下一步

1. 📖 閱讀完整指南: [FRAMEWORK_GUIDE.md](FRAMEWORK_GUIDE.md)
2. 🔧 客製化你的 CLAUDE.md
3. 🤖 探索更多 Agent 功能
4. 📊 建立專案儀表板

---

## 💡 專業提示

```javascript
// 提示 1: 並行執行節省時間
await Promise.all([
  Task({ subagent_type: "test-generator", ... }),
  Task({ subagent_type: "api-documenter", ... }),
  Bash({ command: "npm run lint" })
]);

// 提示 2: 使用標籤組織任務
await mcp__task-manager__create_task({
  title: "重要功能",
  tags: ["sprint-1", "backend", "api", "urgent"]
});

// 提示 3: 批次更新任務
const tasks = await mcp__task-manager__list_tasks({
  status: "in_progress"
});
for (const task of tasks) {
  // 批次處理
}
```

---

**需要幫助？** 
- 輸入 `/help` 查看 Claude Code 說明
- 查看 [GitHub Issues](https://github.com/anthropics/claude-code/issues)

*Happy Coding! 🚀*