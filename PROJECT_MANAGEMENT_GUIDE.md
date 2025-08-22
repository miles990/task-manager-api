# 📁 Claude Code 專案管理指南

## 🎯 為什麼需要專案管理？

當你有多個專案時，每個專案可能：
- 使用不同的程式語言（Go、Node.js、Python）
- 有不同的測試命令
- 需要不同的 Agent 配置
- 有各自的 MCP 設定

**專案管理器**讓你輕鬆切換和管理多個專案。

## 🚀 快速開始

### 1. 安裝專案管理器

```bash
# 下載管理器
curl -O https://raw.githubusercontent.com/your-repo/claude-project-manager.sh
chmod +x claude-project-manager.sh

# 建立別名（建議）
echo "alias cpm='~/claude-project-manager.sh'" >> ~/.bashrc
source ~/.bashrc
```

### 2. 添加你的專案

```bash
# 添加 Go 專案
cpm add my-go-api /Users/john/projects/my-go-api

# 添加 Node.js 專案
cpm add my-node-app /Users/john/projects/my-node-app

# 添加當前目錄為專案
cpm add my-project .
```

### 3. 切換專案

```bash
# 列出所有專案
cpm list

# 切換到指定專案
cpm switch my-go-api

# 顯示當前專案
cpm current
```

### 4. 初始化框架

```bash
# 為當前專案初始化
cpm init

# 為指定專案初始化
cpm init my-go-api
```

### 5. 開啟專案

```bash
# 開啟當前專案並啟動 Claude Code
cpm open

# 開啟指定專案
cpm open my-go-api
```

## 📂 專案結構

```
~/.claude/                    # Claude 全域配置目錄
├── projects.json            # 所有專案配置
├── current_project          # 當前專案標記
├── current/                 # 當前專案符號連結
└── templates/               # 專案模板
    ├── go/
    ├── node/
    └── python/
```

### projects.json 範例

```json
{
  "my-go-api": {
    "path": "/Users/john/projects/my-go-api",
    "type": "go",
    "created": "2024-01-15",
    "last_used": "2024-01-20",
    "settings": {
      "test_command": "go test -v ./...",
      "lint_command": "golangci-lint run",
      "mcp_enabled": true
    }
  },
  "my-node-app": {
    "path": "/Users/john/projects/my-node-app",
    "type": "node",
    "created": "2024-01-10",
    "last_used": "2024-01-18",
    "settings": {
      "test_command": "npm test",
      "lint_command": "npm run lint",
      "mcp_enabled": true
    }
  }
}
```

## 💡 使用場景

### 場景 1: 多專案開發者

```bash
# 早上開發 Go API
cpm switch backend-api
cpm open
# Claude Code 自動載入 Go 專案配置

# 下午開發前端
cpm switch frontend-app
cpm open
# Claude Code 自動載入 Node.js 配置
```

### 場景 2: 新專案設定

```bash
# 創建新專案
mkdir new-project && cd new-project
go mod init github.com/user/new-project

# 添加到管理器
cpm add new-project .

# 初始化框架
cpm init
# 自動檢測 Go 專案並生成對應配置
```

### 場景 3: 團隊協作

```bash
# 團隊成員 A 設定專案
cpm add team-project /shared/projects/team-project
cpm init team-project

# 團隊成員 B 使用
cpm add team-project /shared/projects/team-project
cpm switch team-project
cpm open
# 使用相同的 CLAUDE.md 配置
```

## 🔧 進階功能

### 自訂專案配置

編輯 `~/.claude/projects.json` 添加自訂設定：

```json
{
  "my-project": {
    "path": "/path/to/project",
    "type": "go",
    "settings": {
      "test_command": "make test",
      "lint_command": "make lint",
      "build_command": "make build",
      "custom_commands": {
        "/deploy": "make deploy",
        "/docker": "docker-compose up"
      },
      "auto_hooks": {
        "pre_commit": ["make lint", "make test"],
        "post_edit": ["gofmt -w"]
      },
      "preferred_agents": [
        "test-generator",
        "code-reviewer",
        "database-optimizer"
      ]
    }
  }
}
```

### 專案模板

創建專案模板以快速初始化：

```bash
# 創建 Go 專案模板
mkdir -p ~/.claude/templates/go
cat > ~/.claude/templates/go/CLAUDE.md << 'EOF'
# CLAUDE.md - Go Project Template
[模板內容]
EOF

# 使用模板
cpm init --template go
```

### 環境變數支援

```bash
# 設定專案特定環境變數
export CLAUDE_PROJECT=my-go-api
export CLAUDE_PROJECT_PATH=/Users/john/projects/my-go-api

# Claude Code 會自動識別
claude
```

## 🎯 最佳實踐

### 1. 專案命名規範

```bash
# 好的命名
cpm add backend-api /path/to/backend
cpm add frontend-web /path/to/frontend
cpm add mobile-ios /path/to/ios

# 避免
cpm add proj1 /path
cpm add test /path
```

### 2. 定期清理

```bash
# 移除不再使用的專案
cpm remove old-project

# 列出並檢查
cpm list
```

### 3. 備份配置

```bash
# 備份專案配置
cp ~/.claude/projects.json ~/.claude/projects.json.backup

# 匯出配置
cat ~/.claude/projects.json > my-projects-backup.json
```

## 🔍 疑難排解

### 問題: 找不到專案

```bash
# 檢查專案列表
cpm list

# 重新添加
cpm add project-name /correct/path
```

### 問題: 專案路徑變更

```bash
# 移除舊的
cpm remove old-project

# 添加新的
cpm add old-project /new/path
```

### 問題: 配置損壞

```bash
# 重置配置
rm -rf ~/.claude
cpm list  # 會自動重建
```

## 📊 專案狀態檢查

在 Claude Code 中使用：

```javascript
// 檢查當前專案
async function checkProject() {
  // 顯示專案資訊
  console.log("當前專案:", process.cwd());
  
  // 檢查 CLAUDE.md
  const hasConfig = await Read({ file_path: "CLAUDE.md" });
  
  // 列出任務
  await mcp__task-manager__list_tasks();
  
  // 顯示統計
  await mcp__task-manager__get_task_stats();
}

await checkProject();
```

## 🚀 整合到工作流程

### Shell 別名設定

```bash
# ~/.bashrc 或 ~/.zshrc
alias cpm='~/claude-project-manager.sh'
alias ccnew='cpm add'
alias ccswitch='cpm switch'
alias ccopen='cpm open'
alias ccinit='cpm init'
alias cclist='cpm list'

# 快速切換常用專案
alias backend='cpm switch backend-api && cpm open'
alias frontend='cpm switch frontend-web && cpm open'
```

### VS Code 整合

```json
// .vscode/settings.json
{
  "terminal.integrated.env.linux": {
    "CLAUDE_PROJECT": "${workspaceFolderBasename}"
  },
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Open in Claude",
        "type": "shell",
        "command": "cpm open ${workspaceFolderBasename}"
      }
    ]
  }
}
```

## 📝 總結

專案管理器讓你能夠：

1. **集中管理**所有專案配置
2. **快速切換**不同專案環境
3. **自動載入**專案特定設定
4. **統一初始化**新專案
5. **追蹤使用**歷史和狀態

這樣無論你有多少個專案，都能輕鬆管理和使用 Claude Code 框架！

---

**快速指令參考：**

```bash
cpm add [name] [path]    # 添加專案
cpm list                  # 列出專案
cpm switch [name]         # 切換專案
cpm current               # 當前專案
cpm init [name]           # 初始化
cpm remove [name]         # 移除專案
cpm open [name]           # 開啟專案
```

*Happy Multi-Project Development! 🎉*