# 🚀 Claude Code 自動化框架 - 快速部署指南

## 一鍵部署到你的專案

### 方法 1: 最快速部署（10秒完成）

```bash
# 在你的專案目錄執行
curl -sSL https://raw.githubusercontent.com/your-repo/setup-framework.sh | bash
```

### 方法 2: 使用 Node.js 腳本

```bash
# 在專案目錄執行
npx @your-package/claude-framework-setup

# 或下載後執行
node quick-setup.js
```

### 方法 3: 手動執行

```bash
# 1. 下載腳本
wget https://raw.githubusercontent.com/your-repo/setup-framework.sh

# 2. 執行腳本
chmod +x setup-framework.sh
./setup-framework.sh

# 3. 按照提示操作
```

---

## 📦 腳本功能

### `setup-framework.sh` - Shell 自動化腳本
- **功能**：
  - 自動檢測專案類型（Node.js, Python, Go, Rust, Java 等）
  - 生成客製化的 CLAUDE.md
  - 創建 MCP 配置（可選）
  - 生成初始化腳本
  - 創建快速命令工具
  - 設定 .claudeignore

- **使用方式**：
  ```bash
  ./setup-framework.sh [專案路徑]
  ```

### `quick-setup.js` - Node.js 互動式設定
- **功能**：
  - 互動式問答設定
  - 支援多語言專案
  - 自訂命令配置
  - 功能模組選擇（API, Database, Auth, Realtime）

- **使用方式**：
  ```bash
  node quick-setup.js
  ```

---

## 🎯 使用場景

### 場景 1: 全新 Node.js 專案

```bash
# 創建專案
mkdir my-app && cd my-app
npm init -y

# 執行設定腳本
curl -sSL https://raw.githubusercontent.com/your-repo/setup-framework.sh | bash

# 啟動 Claude Code
claude

# 初始化（在 Claude Code 中）
node claude-init.js
```

### 場景 2: 現有 Python 專案

```bash
cd existing-python-project

# 執行 Node.js 設定腳本（更多自訂選項）
node quick-setup.js

# 回答問題：
# - 專案名稱: my-api
# - 包含 API 開發?: y
# - 使用資料庫?: y
# - 測試命令: pytest
# - Lint 命令: flake8

# 完成後啟動 Claude Code
claude
```

### 場景 3: 快速測試框架

```bash
# 建立測試專案
mkdir test-project && cd test-project

# 最簡化設定
echo '# CLAUDE.md' > CLAUDE.md
claude

# 在 Claude Code 中直接使用
await mcp__task-manager__create_task({
  title: "測試任務",
  priority: "low"
});
```

---

## 📋 生成的檔案說明

### 1. **CLAUDE.md**
專案的核心配置檔案，包含：
- 專案資訊和技術棧
- 自動化工作流程
- Agent 觸發規則
- MCP 指令參考

### 2. **claude-init.js**
初始化腳本，在 Claude Code 中執行：
```javascript
// 自動創建初始任務
// 設定 TodoWrite
// 顯示專案統計
node claude-init.js
```

### 3. **claude-commands.sh**
快速命令工具：
```bash
./claude-commands.sh task "新功能"  # 創建任務
./claude-commands.sh list           # 列出任務
./claude-commands.sh stats          # 查看統計
./claude-commands.sh test           # 生成測試
./claude-commands.sh review         # 審查程式碼
```

### 4. **.claudeignore**
忽略不需要的檔案：
```
node_modules/
.git/
dist/
build/
*.log
```

### 5. **mcp-config.json**（可選）
MCP 服務器配置：
```json
{
  "mcpServers": {
    "task-manager": {
      "command": "node",
      "args": ["src/mcp-server.js"]
    }
  }
}
```

---

## 🔧 進階配置

### 自訂專案模板

編輯腳本中的模板部分：

```javascript
// quick-setup.js
const getProjectConfig = (type) => {
    // 添加你的專案類型
    myframework: {
        language: 'MyLang',
        testCommand: 'mytest',
        // ...
    }
};
```

### 添加企業特定規則

在 CLAUDE.md 模板中加入：

```markdown
## 企業規範
- 程式碼審查流程
- 部署前檢查清單
- 安全掃描要求
```

### 整合 CI/CD

```yaml
# .github/workflows/claude-check.yml
name: Claude Code Check
on: [push]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Validate CLAUDE.md
        run: |
          if [ ! -f "CLAUDE.md" ]; then
            echo "Missing CLAUDE.md"
            exit 1
          fi
```

---

## 💡 使用提示

### 快速初始化程式碼（複製到 Claude Code）

```javascript
// 方案 1: 最簡單
await mcp__task-manager__create_task({
  title: "開始開發",
  priority: "high"
});

// 方案 2: 完整初始化
async function init() {
  // 創建專案任務
  const project = await mcp__task-manager__create_task({
    title: "專案設定",
    priority: "high",
    status: "in_progress"
  });
  
  // 設定 Todo
  await TodoWrite([
    { content: "設定環境", status: "pending" },
    { content: "安裝依賴", status: "pending" },
    { content: "首次提交", status: "pending" }
  ]);
  
  // 顯示統計
  await mcp__task-manager__get_task_stats();
  
  console.log("✅ 初始化完成！");
}

await init();
```

### 驗證安裝

```bash
# 檢查檔案
ls -la CLAUDE.md claude-init.js

# 測試 MCP（如果有安裝）
claude mcp list

# 查看配置
cat CLAUDE.md | head -20
```

---

## ❓ 常見問題

### Q: 腳本執行失敗？
```bash
# 給予執行權限
chmod +x setup-framework.sh
chmod +x quick-setup.js

# 使用 sudo（如需要）
sudo ./setup-framework.sh
```

### Q: 專案類型檢測錯誤？
```bash
# 手動指定類型
node quick-setup.js
# 選擇 "自訂" 並手動輸入配置
```

### Q: MCP 無法連接？
```javascript
// 在 Claude Code 中測試
try {
  await mcp__task-manager__get_task_stats();
  console.log("✅ MCP 正常");
} catch (e) {
  console.log("❌ MCP 未啟動");
}
```

---

## 📚 相關資源

- [完整使用指南](FRAMEWORK_GUIDE.md)
- [快速參考手冊](QUICK_START.md)
- [CLAUDE.md 模板](CLAUDE.md)
- [GitHub Repository](https://github.com/your-repo)

---

## 🤝 貢獻

歡迎提交 PR 改進腳本！

1. Fork 專案
2. 創建分支 (`git checkout -b feature/improve-setup`)
3. 提交變更 (`git commit -am 'Add new feature'`)
4. 推送 (`git push origin feature/improve-setup`)
5. 開啟 Pull Request

---

**需要幫助？**
- 開啟 [Issue](https://github.com/your-repo/issues)
- 查看 [Discussions](https://github.com/your-repo/discussions)

*Happy Coding with Claude Code! 🎉*