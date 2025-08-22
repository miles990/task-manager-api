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
4. 使用 test-generator sub-agent 生成測試
5. 使用 code-reviewer sub-agent 審查程式碼
6. 運行 npm run lint 和 npm test
```

### 2. 修復錯誤時
```
1. 重現錯誤並理解根本原因
2. 編寫失敗的測試案例
3. 修復錯誤使測試通過
4. 確保其他測試仍然通過
```

### 3. 重構程式碼時
```
1. 確保有完整的測試覆蓋
2. 小步驟進行重構
3. 每步後運行測試
4. 保持 API 向後相容
```

## Sub-agents 使用指引

### code-reviewer
- 在完成重要功能後主動使用
- 特別關注安全性和性能問題

### test-generator
- 為所有新的公開方法生成測試
- 包含邊界情況和錯誤場景

### api-documenter
- 在 API 變更後更新文檔
- 生成 OpenAPI 規範

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

---

*記住：始終優先考慮程式碼品質、測試覆蓋和文檔完整性。*
- 每個操作前都先use context7
- 每次使用者提需求 如果沒指定agent的話 請幫我決定要trigger的agent以及執行順序