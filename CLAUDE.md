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

## Sub-agents 自動觸發規則

### code-reviewer (自動觸發條件)
- ✅ 完成任何新功能實作後
- ✅ 修改超過 50 行程式碼後
- ✅ 修改任何安全相關程式碼（auth, validation, encryption）
- ✅ 修改資料庫操作相關程式碼
- ✅ 執行 npm run pre-commit 前

### test-generator (自動觸發條件)
- ✅ 新增任何公開 API endpoint
- ✅ 新增任何 public method
- ✅ 修改現有功能的邏輯
- ✅ 修復 bug 後（確保有回歸測試）

### api-documenter (自動觸發條件)
- ✅ 新增或修改 API endpoint
- ✅ 更改 request/response 格式
- ✅ 修改錯誤碼定義
- ✅ 新增或移除 API 參數

### database-optimizer (自動觸發條件)
- ✅ 新增資料表或欄位
- ✅ 查詢效能問題（執行時間 > 100ms）
- ✅ 準備從記憶體遷移到資料庫時

### api-tester (自動觸發條件)
- ✅ 部署前的最終檢查
- ✅ 完成多個 API 修改後
- ✅ 進行負載測試需求時

## MCP 整合點

當實作以下功能時，考慮使用 MCP 整合：

1. **持久化儲存** - 使用 SQLite MCP
2. **問題追蹤** - 使用 GitHub MCP
3. **通知系統** - 使用 Slack MCP
4. **外部 API** - 使用適當的 MCP 服務器

## 自動化 Hooks

已配置的 hooks 會自動：
- 格式化程式碼（post-tool-use）
- 運行測試（pre-commit）
- 執行安全審計（npm install 後）

## 常用命令

```bash
# 開發
npm run dev

# 測試
npm test

# 程式碼品質
npm run lint
npm run format
npm run typecheck

# 綜合檢查
npm run pre-commit
```

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

### Agent 自動決策流程
當使用者提出需求時，依照以下順序自動決定：

1. **分析需求類型：**
   - 🔧 修復類 → 先 grep/read 找問題 → 修復 → test-generator → code-reviewer
   - ✨ 新功能 → TodoWrite 規劃 → 實作 → test-generator → api-documenter → code-reviewer
   - ♻️ 重構類 → 先跑測試 → 重構 → 測試 → code-reviewer
   - 📚 文檔類 → api-documenter
   - 🔍 查詢類 → 使用 grep/glob 搜尋

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

*記住：始終優先考慮程式碼品質、測試覆蓋和文檔完整性。*

**核心原則：**
- 主動執行檢查，不等使用者要求
- 平行處理提升效率
- 失敗立即修復，不累積技術債
- 每個操作都要有對應的測試和文檔