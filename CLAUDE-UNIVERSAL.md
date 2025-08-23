# CLAUDE.md - Universal Project Manager

這個檔案為 Claude Code 提供通用專案管理框架的指引和上下文。

## 框架概述

Universal Project Manager 是一個基於 Claude Code 最佳實踐的通用專案管理框架，支援多種專案類型的統一管理和智能協作。這個框架將原本專用於任務管理的架構擴展為可管理任何類型專案的通用解決方案。

### 🎯 核心特色

- **🌐 多專案支援**: 統一管理 Node.js、React、Python、Go 等各種專案
- **🤖 智能 MCP 整合**: 動態載入專案特定的 MCP 工具
- **⚡ 自動化工作流**: 保留原有的 Agent 協作和自動化功能
- **🔧 靈活配置**: 基於配置文件的專案管理，支援動態切換
- **📦 模板化創建**: 內建多種專案模板，快速啟動新專案

## 支援的專案類型

| 專案類型 | 描述 | MCP 支援 | 主要功能 |
|----------|------|----------|----------|
| **node-api** | Node.js API 專案 | ✅ | Express、資料庫、任務管理 |
| **react-app** | React 前端專案 | ❌ | SPA、元件庫 |
| **python-api** | Python API 專案 | ✅ | FastAPI、異步處理 |
| **go-api** | Go API 專案 | ✅ | 高效能 API、並發處理 |
| **existing** | 現有專案 | 🔧 | 自動偵測類型 |

## 快速開始

### 1. 初始化框架
```bash
# 初始化通用專案管理框架
node setup.js framework

# 查看框架狀態
npm run start:framework
```

### 2. 創建新專案
```bash
# 創建 Node.js API 專案
node setup.js node-api my-api ./projects/my-api

# 創建 React 前端專案
node setup.js react-app my-frontend ./projects/my-frontend

# 創建 Python API 專案
node setup.js python-api my-python-api ./projects/my-python-api

# 添加現有專案到框架
node setup.js existing legacy-project ./existing/path
```

### 3. 使用 MCP 管理專案
```bash
# 在 Claude Code 中使用以下工具：
mcp__universal-project-manager__get_framework_status()
mcp__universal-project-manager__list_projects()
mcp__universal-project-manager__switch_project(projectName="my-api")
```

## 開發指引

### 程式碼風格（適用所有專案類型）
- **Node.js**: 使用 ES6+ 語法，遵循 Airbnb 風格指南
- **React**: 使用 Hooks 優先，遵循 React 最佳實踐
- **Python**: 遵循 PEP 8，使用 type hints
- **Go**: 遵循官方 Go 代碼規範
- 所有專案都應包含完整的文檔和測試

### 錯誤處理統一標準
- **API 專案**: 集中式錯誤處理中介軟體
- **前端專案**: Error Boundaries 和全域錯誤處理
- **所有專案**: 統一的錯誤回應格式

### 測試要求
- 新功能必須包含測試
- 測試覆蓋率保持在 80% 以上
- 使用專案對應的測試框架
- 測試檔案遵循專案結構慣例

## Universal Claude Code 工作流程

### 1. 專案管理流程
```
1. 【框架初始化】使用 setup.js framework 建立基礎配置
2. 【專案創建】根據需求選擇適當模板創建專案
3. 【MCP 註冊】自動註冊專案特定的 MCP 工具
4. 【動態切換】使用 switch_project 工具在專案間切換
5. 【統一管理】通過框架配置管理所有專案生命週期
```

### 2. 開發流程（通用版）
```
1. 【需求分析】
   - 判斷專案類型和複雜度
   - 自動選擇合適的 Agent 組合
   - 根據專案特性調整工作流程

2. 【專案切換】
   - mcp__universal-project-manager__switch_project(projectName)
   - 自動載入專案特定配置和工具
   - 更新開發環境和 MCP 工具

3. 【功能開發】
   if (node-api || python-api || go-api):
     - 使用 TodoWrite 規劃 API 開發任務
     - 實作路由、服務、資料模型
     - 【自動】test-generator 生成 API 測試
     - 【自動】api-documenter 更新文檔
   
   if (react-app):
     - 規劃元件開發任務
     - 實作元件、Hooks、狀態管理
     - 【自動】test-generator 生成元件測試
     - 【自動】storybook 更新元件庫

4. 【品質保證】
   - 【自動】執行專案特定的 lint 規則
   - 【自動】運行測試套件
   - 【自動】code-reviewer 審查程式碼
   - 【自動】檢查測試覆蓋率

5. 【文檔更新】
   - 【自動】api-documenter 更新 API 文檔
   - 【自動】更新 README 和專案文檔
   - 【自動】生成 changelog
```

### 3. 跨專案協作流程
```
1. 【全域狀態檢查】get_framework_status 查看所有專案狀態
2. 【專案間依賴】自動偵測和管理專案間的依賴關係
3. 【統一發布】支援多專案的協調發布和版本管理
4. 【跨專案測試】端對端測試涵蓋多個相關專案
```

## MCP-Agent 智能協作系統 2.0

### 🤖 通用 Agent + MCP 自動化矩陣

| Agent | 適用專案類型 | MCP 整合 | 自動觸發時機 |
|-------|-------------|----------|-------------|
| **universal-project-manager** | 所有類型 | `mcp__universal-project-manager__*` | 任何專案管理操作 |
| **api-specialist** | node-api, python-api, go-api | `mcp__task-manager__*` | API 開發和測試 |
| **frontend-specialist** | react-app, vue-app | `mcp__ui-tester__*` | 前端開發和測試 |
| **code-reviewer** | 所有類型 | `mcp__task-manager__update_task` | 程式碼完成後 |
| **test-generator** | 所有類型 | `mcp__task-manager__create_task` | 新增功能時 |
| **database-optimizer** | API 專案 | `mcp__database__*` | 資料庫操作時 |

### 🔄 多專案智能工作流程 3.0

#### 1. 專案創建和初始化流程
```yaml
觸發: node setup.js [type] [name] [path]
執行順序:
  1. 【專案類型分析】:
     - 根據類型載入對應模板
     - 初始化專案特定配置
     - 設定 MCP 工具集
  
  2. 【自動化建置】:
     - 創建專案結構和檔案
     - 安裝專案依賴
     - 初始化版本控制
  
  3. 【MCP 註冊】:
     - mcp__universal-project-manager__add_project
     - 註冊專案特定 MCP 工具
     - 更新 Claude Code MCP 配置
  
  4. 【開發環境設定】:
     - 配置 IDE 設定檔
     - 設定 linting 和 formatting 規則
     - 建立 CI/CD pipeline 模板
```

#### 2. 跨專案功能開發流程
```yaml
觸發: 涉及多個專案的功能需求
執行順序:
  1. 【需求分析】:
     - 識別涉及的專案
     - 分析專案間依賴關係
     - 規劃開發順序
  
  2. 【並行開發】:
     for each 相關專案:
       - mcp__universal-project-manager__switch_project
       - 執行專案特定開發流程
       - 更新專案間 API 介面
  
  3. 【整合測試】:
     - 跨專案整合測試
     - API 契約測試
     - 端對端測試流程
  
  4. 【統一發布】:
     - 版本相容性檢查
     - 協調發布順序
     - 更新所有相關文檔
```

#### 3. 專案遷移和重構流程
```yaml
觸發: 需要遷移專案類型或進行大規模重構
執行順序:
  1. 【現狀分析】:
     - mcp__universal-project-manager__get_project_info
     - 分析現有程式碼結構
     - 評估遷移複雜度
  
  2. 【遷移計畫】:
     - 選擇目標專案類型
     - 建立遷移對照表
     - 設定測試驗證標準
  
  3. 【逐步遷移】:
     - 創建新專案結構
     - 逐步遷移程式碼和配置
     - 保持功能對等性驗證
  
  4. 【切換和清理】:
     - 更新專案配置
     - 切換 MCP 工具集
     - 清理舊專案資源
```

## 配置系統說明

### 專案配置檔案結構
```javascript
// config/projects.json
{
  "framework": {
    "name": "Universal Project Manager",
    "version": "2.0.0"
  },
  "defaultProject": "project-name",
  "projects": {
    "project-name": {
      "type": "node-api",
      "config": { /* 專案特定配置 */ },
      "features": { /* 功能開關 */ },
      "scripts": { /* 執行腳本 */ }
    }
  },
  "templates": { /* 專案模板定義 */ },
  "globalSettings": { /* 全域設定 */ }
}
```

### 動態配置載入
```javascript
const config = require('./src/config');

// 切換專案
config.switchProject('another-project');

// 檢查功能
if (config.hasFeature('taskManagement')) {
  // 載入任務管理功能
}

// 獲取 MCP 配置
const mcpConfig = config.mcp;
```

## MCP 工具使用指南

### 框架管理工具（通用）
```javascript
// 查看框架狀態
mcp__universal-project-manager__get_framework_status()

// 列出所有專案
mcp__universal-project-manager__list_projects()

// 查看專案詳情
mcp__universal-project-manager__get_project_info(projectName="my-project")

// 切換專案
mcp__universal-project-manager__switch_project(projectName="another-project")

// 添加新專案
mcp__universal-project-manager__add_project({
  name: "new-project",
  type: "react-app",
  description: "New React application",
  rootPath: "/path/to/project"
})
```

### 專案特定工具（依專案類型動態載入）
```javascript
// 任務管理工具（僅在具備 taskManagement 功能的專案中可用）
mcp__universal-project-manager__create_task(title="Implement feature")
mcp__universal-project-manager__list_tasks(status="in_progress")
mcp__universal-project-manager__get_task_stats()

// API 專案特定工具
mcp__api-manager__generate_docs()
mcp__api-manager__test_endpoints()

// 前端專案特定工具
mcp__ui-tester__component_snapshot()
mcp__ui-tester__accessibility_check()
```

## 最佳實踐

### 1. 專案組織
- **單一責任**: 每個專案專注於特定功能或服務
- **清晰邊界**: 明確定義專案間的介面和依賴
- **統一標準**: 所有專案遵循統一的程式碼和文檔標準
- **版本管理**: 使用語義化版本管理專案發布

### 2. 開發流程
- **配置優先**: 通過配置管理專案特性而非硬編碼
- **測試驅動**: 先寫測試再實作功能
- **文檔同步**: 程式碼變更時同步更新文檔
- **持續整合**: 自動化測試和部署流程

### 3. 協作管理
- **專案隔離**: 各專案獨立開發，避免相互干擾
- **介面契約**: API 變更需通知所有依賴專案
- **知識共享**: 通過 MCP 工具分享最佳實踐
- **程式碼審查**: 跨專案的程式碼審查標準

### 4. 維護策略
- **定期更新**: 定期更新依賴和安全修補
- **效能監控**: 監控各專案的效能指標
- **技術債務**: 定期評估和清理技術債務
- **備份恢復**: 建立完整的備份和災難恢復流程

## 故障排除

### 常見問題及解決方案

#### 1. MCP 工具載入失敗
```bash
# 檢查專案配置
mcp__universal-project-manager__get_project_info()

# 重新載入配置
const config = require('./src/config');
config.reload();

# 檢查功能是否啟用
config.hasFeature('taskManagement')
```

#### 2. 專案切換失敗
```bash
# 驗證專案配置
node setup.js existing project-name /path/to/project

# 檢查專案路徑
ls -la /path/to/project

# 重新初始化專案
cd /path/to/project
npm install  # 或對應的依賴安裝命令
```

#### 3. 配置文件損壞
```bash
# 備份現有配置
cp config/projects.json config/projects.json.backup

# 重新初始化框架
node setup.js framework

# 重新添加專案
node setup.js existing project-name /path/to/project
```

## 擴展開發

### 添加新的專案類型
1. 在 `setup.js` 中添加新模板定義
2. 實作對應的檔案生成器
3. 更新 `config/projects.json` 模板配置
4. 添加專案類型特定的 MCP 工具

### 自定義 MCP 工具
1. 在 `src/mcp-server-universal.js` 中添加工具定義
2. 實作工具邏輯
3. 更新工具文檔
4. 添加相應測試

### 整合第三方服務
1. 創建服務適配器
2. 更新專案配置結構
3. 添加相應的 MCP 工具
4. 更新設定和文檔

---

## 🎯 核心原則

- **🌍 通用性優先**: 架構設計支援各種專案類型
- **🤖 智能自動化**: 最大化利用 AI 和自動化能力
- **⚡ 開發效率**: 快速專案創建和管理
- **🔧 彈性配置**: 通過配置適應不同需求
- **📈 可擴展性**: 易於添加新功能和專案類型
- **🧪 品質保證**: 內建測試和程式碼審查機制

**Universal Project Manager - 讓每個專案都成為 Claude Code 的最佳實踐範例！**