# Universal Project Manager - 快速開始指南

## 🚀 5 分鐘快速上手

### 步驟 1: 初始化框架
```bash
# 初始化通用專案管理框架
node setup.js framework

# 檢查框架狀態
npm run start:framework
```

### 步驟 2: 創建你的第一個專案
```bash
# Node.js API 專案
node setup.js node-api my-first-api ./projects/my-first-api

# React 前端專案  
node setup.js react-app my-frontend ./projects/my-frontend

# 或添加現有專案
node setup.js existing my-existing-project ./path/to/existing
```

### 步驟 3: 在 Claude Code 中使用
```javascript
// 查看框架狀態
mcp__universal-project-manager__get_framework_status()

// 列出所有專案
mcp__universal-project-manager__list_projects()

// 切換到特定專案
mcp__universal-project-manager__switch_project(projectName="my-first-api")
```

## 📋 支援的專案類型

| 類型 | 命令 | 說明 | MCP 支援 |
|------|------|------|----------|
| **Node.js API** | `node setup.js node-api name path` | Express + SQLite + 任務管理 | ✅ 完整支援 |
| **React 應用** | `node setup.js react-app name path` | React + 現代前端工具鏈 | ❌ 前端專案 |
| **Python API** | `node setup.js python-api name path` | FastAPI + 非同步處理 | ✅ 完整支援 |
| **Go API** | `node setup.js go-api name path` | 高效能 API 服務 | ✅ 完整支援 |
| **現有專案** | `node setup.js existing name path` | 加入現有專案到框架 | 🔧 依專案類型 |

## 🛠️ 常用操作

### 專案管理
```bash
# 查看幫助
node setup.js

# 檢查框架狀態
node setup.js framework

# 添加現有專案
node setup.js existing legacy-app /path/to/legacy
```

### MCP 工具使用
```javascript
// 框架管理
mcp__universal-project-manager__get_framework_status()
mcp__universal-project-manager__list_projects()
mcp__universal-project-manager__switch_project(projectName="project-name")

// 專案操作（需先切換到對應專案）
mcp__universal-project-manager__get_project_info()
mcp__universal-project-manager__create_task(title="New feature")  // 僅任務管理專案
mcp__universal-project-manager__get_task_stats()                  // 僅任務管理專案
```

## 📁 專案結構範例

### Node.js API 專案
```
my-api/
├── src/
│   ├── config/
│   │   └── index.js          # 專案配置
│   ├── routes/               # API 路由
│   ├── services/             # 業務邏輯
│   ├── index.js              # 主程式
│   └── mcp-server.js         # MCP 伺服器
├── tests/                    # 測試檔案
├── package.json
└── README.md
```

### React 前端專案
```
my-frontend/
├── src/
│   ├── components/           # React 元件
│   ├── hooks/                # 自定義 Hooks
│   ├── App.js                # 主應用程式
│   └── index.js              # 入口點
├── public/
│   └── index.html
├── package.json
└── README.md
```

## ⚡ 開發工作流程

### 1. 專案創建流程
```
創建專案 → 安裝依賴 → 初始化 Git → 註冊到框架 → 開始開發
```

### 2. 日常開發流程
```
切換專案 → 檢查狀態 → 開發功能 → 測試驗證 → 提交程式碼
```

### 3. 多專案協作流程
```
查看所有專案 → 識別依賴關係 → 協調開發順序 → 整合測試 → 統一發布
```

## 🎯 MCP 整合說明

### 自動載入機制
- 切換專案時，MCP 工具會根據專案類型動態載入
- 只有具備相應功能的專案才會載入對應工具
- 例如：只有 Node.js API 專案才會載入任務管理工具

### 專案特定工具
```javascript
// 任務管理專案（node-api 且啟用 taskManagement）
create_task, list_tasks, update_task, delete_task, get_task_stats

// API 專案（node-api, python-api, go-api）
get_api_status, test_endpoints, generate_docs

// 前端專案（react-app）
component_test, build_optimize, accessibility_check
```

## 🔧 配置說明

### 專案配置檔案
主配置檔案位於 `config/projects.json`：

```json
{
  "defaultProject": "my-first-api",
  "projects": {
    "my-first-api": {
      "type": "node-api",
      "features": {
        "taskManagement": true,
        "apiServer": true,
        "database": true,
        "mcp": true
      }
    }
  }
}
```

### 環境變數
```bash
# 設定預設專案
export PROJECT_NAME="my-first-api"

# 啟用/禁用 MCP
export MCP_ENABLED="true"

# 資料庫路徑
export DATABASE_PATH="./data/app.db"
```

## 🐛 故障排除

### 常見問題

#### Q: MCP 工具不可用
```bash
# 檢查專案是否正確切換
mcp__universal-project-manager__get_framework_status()

# 檢查專案功能配置
mcp__universal-project-manager__get_project_info()

# 重新載入配置
npm run start:framework
```

#### Q: 專案創建失敗
```bash
# 檢查路徑權限
ls -la /path/to/parent/directory

# 檢查模板是否存在
node setup.js  # 查看支援的專案類型

# 手動創建並添加
mkdir my-project && cd my-project
npm init -y
cd .. && node setup.js existing my-project ./my-project
```

#### Q: 依賴安裝失敗
```bash
# Node.js 專案
cd project-path && npm install

# Python 專案
cd project-path && pip install -r requirements.txt

# Go 專案
cd project-path && go mod download
```

## 🎨 自定義和擴展

### 添加自定義專案類型
1. 編輯 `setup.js`，在 `templates` 中添加新類型
2. 實作對應的檔案生成器
3. 更新 `config/projects.json` 模板定義

### 添加 MCP 工具
1. 編輯 `src/mcp-server-universal.js`
2. 在 `generateTools()` 中添加工具定義
3. 在 `CallToolRequestSchema` handler 中實作邏輯

### 客製化專案模板
```javascript
// 在 setup.js 的 templates 中自定義
'my-custom-type': {
  description: '我的自定義專案類型',
  files: {
    'custom-file.js': (name, type) => `// 自定義檔案內容`
  },
  directories: ['custom-dir']
}
```

## 📚 進階功能

### 專案間依賴管理
- 自動偵測專案間的 API 依賴
- 協調多專案的發布順序
- 跨專案的整合測試支援

### 批次操作
```javascript
// 批次更新所有專案
mcp__universal-project-manager__batch_update_projects()

// 批次執行測試
mcp__universal-project-manager__batch_test_projects()

// 批次生成文檔
mcp__universal-project-manager__batch_generate_docs()
```

### CI/CD 整合
- 自動生成 GitHub Actions 配置
- 支援多專案的 Pipeline 配置
- 整合部署腳本生成

## 🌟 最佳實踐

### 1. 專案命名
- 使用有意義的名稱：`user-service`, `admin-dashboard`
- 避免特殊字元，使用連字符分隔
- 保持名稱簡潔但具描述性

### 2. 專案組織
```
projects/
├── backend/
│   ├── user-api/
│   ├── notification-service/
│   └── shared-models/
├── frontend/
│   ├── admin-dashboard/
│   ├── user-portal/
│   └── shared-components/
└── tools/
    ├── deployment-scripts/
    └── testing-utilities/
```

### 3. 配置管理
- 使用環境變數管理敏感配置
- 為不同環境維護不同的配置檔案
- 定期備份專案配置

### 4. 版本控制
- 每個專案使用獨立的 Git 倉庫
- 使用語義化版本號
- 維護清晰的 Changelog

---

## 🚀 立即開始

```bash
# 1. 初始化框架
node setup.js framework

# 2. 創建第一個專案
node setup.js node-api my-awesome-api ./projects/my-awesome-api

# 3. 在 Claude Code 中開始使用
mcp__universal-project-manager__switch_project(projectName="my-awesome-api")
```

**恭喜！您已經準備好使用 Universal Project Manager 了！**

需要更多幫助？查看 [CLAUDE-UNIVERSAL.md](./CLAUDE-UNIVERSAL.md) 了解完整功能說明。