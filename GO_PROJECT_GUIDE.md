# 🚀 Go 專案使用 Claude Code 自動化框架指南

## 📦 Go 專案完整支援

是的！這套框架**完全支援 Go 語言專案**。腳本會自動檢測 `go.mod` 檔案並配置適合 Go 的所有設定。

## 🎯 快速開始 - Go 專案

### 方法 1: 一鍵設定（最快）

```bash
# 在你的 Go 專案目錄執行
cd your-go-project
curl -sSL https://raw.githubusercontent.com/your-repo/setup-framework.sh | bash
```

### 方法 2: 互動式設定

```bash
# 使用 Node.js 腳本（更多自訂選項）
node quick-setup.js
```

腳本會自動檢測到 Go 專案並設定以下內容：

## 🔧 Go 專案自動配置

### 自動檢測
腳本會尋找 `go.mod` 檔案來識別 Go 專案：
- ✅ 檢測 Go 版本
- ✅ 識別使用的框架（Gin、Echo、Fiber 等）
- ✅ 配置正確的命令

### 預設 Go 命令
```bash
# 測試
go test -v ./...

# Lint (需要安裝 golangci-lint)
golangci-lint run

# 格式化
gofmt -w . && goimports -w .

# 開發
go run main.go

# 建構
go build -o bin/app

# 測試覆蓋率
go test -cover ./...

# 基準測試
go test -bench=. ./...
```

## 📝 生成的 CLAUDE.md 範例（Go 專案）

```markdown
# CLAUDE.md - My Go API

## 專案概述
- **語言**: Go
- **執行環境**: Go 1.19+
- **套件管理**: go mod
- **框架**: Gin/Echo/Fiber

## 技術棧
- 語言: Go
- Web 框架: Gin
- 資料庫: PostgreSQL + GORM
- 快取: Redis
- 測試: testing + testify

## 開發指引

### 程式碼風格
- 遵循 Effective Go 指南
- 使用 gofmt 和 goimports 格式化
- 錯誤優先返回模式
- 介面導向設計
- 適當使用 goroutines 和 channels

### 錯誤處理
- 明確的錯誤返回
- 使用 errors.Wrap 提供上下文
- 自定義錯誤類型
- 適當的錯誤日誌

### 測試要求
- 單元測試覆蓋率 > 80%
- 表格驅動測試
- Mock 介面測試
- 基準測試重要功能

## Claude Code 工作流程

### 1. 實作新功能時
1. 先使用 TodoWrite 工具規劃任務
2. 定義介面和結構
3. 實作功能
4. 【自動】使用 test-generator 生成測試
5. 【自動】運行 go test -v ./...
6. 【自動】使用 golangci-lint run 檢查
7. 【自動】使用 code-reviewer 審查

### 2. 修復錯誤時
1. 編寫失敗的測試案例
2. 修復錯誤
3. 【自動】運行 go test ./...
4. 【自動】確保沒有 race condition

## 常用命令
- go run main.go          # 開發
- go test -v ./...        # 測試
- go test -cover ./...    # 覆蓋率
- go test -race ./...     # Race 檢測
- golangci-lint run       # Lint
- go build -o bin/app     # 建構
- go mod tidy             # 整理依賴
```

## 🚀 Go 專案實戰範例

### 範例 1: Gin Web API

```go
// 在你的 Go 專案中
// main.go
package main

import (
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    
    // API 路由
    api := r.Group("/api/v1")
    {
        api.GET("/tasks", GetTasks)
        api.POST("/tasks", CreateTask)
        api.PUT("/tasks/:id", UpdateTask)
        api.DELETE("/tasks/:id", DeleteTask)
    }
    
    r.Run(":8080")
}
```

在 Claude Code 中管理：

```javascript
// 創建 API 開發任務
await mcp__task-manager__create_task({
  title: "實作 Tasks API",
  description: "使用 Gin 框架實作 RESTful API",
  priority: "high",
  tags: ["api", "golang", "gin"]
});

// 生成測試
await Task({
  subagent_type: "test-generator",
  description: "生成 Go 測試",
  prompt: "為 Tasks API 生成表格驅動測試"
});

// 審查程式碼
await Task({
  subagent_type: "code-reviewer",
  description: "審查 Go 程式碼",
  prompt: "檢查錯誤處理、併發安全性和程式碼風格"
});
```

### 範例 2: Go 微服務

```javascript
// 在 Claude Code 中規劃微服務開發
async function developGoMicroservice() {
  // 1. 創建主任務
  const service = await mcp__task-manager__create_task({
    title: "開發使用者微服務",
    priority: "high",
    tags: ["microservice", "golang"]
  });
  
  // 2. 創建子任務
  const subtasks = [
    "設計 gRPC 介面",
    "實作服務邏輯",
    "添加資料庫層 (GORM)",
    "實作快取層 (Redis)",
    "添加監控和日誌",
    "編寫單元測試",
    "編寫整合測試",
    "設定 CI/CD"
  ];
  
  for (const task of subtasks) {
    await mcp__task-manager__create_task({
      title: task,
      priority: "medium",
      tags: ["golang", "subtask"]
    });
  }
  
  // 3. 執行測試
  await Bash({ 
    command: "go test -v -race -cover ./...",
    description: "執行完整測試套件"
  });
  
  // 4. 建構 Docker 映像
  await Bash({
    command: "docker build -t user-service:latest .",
    description: "建構 Docker 映像"
  });
}
```

### 範例 3: 併發處理

```go
// worker.go - 併發任務處理
package main

import (
    "context"
    "sync"
)

type TaskProcessor struct {
    workers int
    tasks   chan Task
    wg      sync.WaitGroup
}

func (p *TaskProcessor) Process(ctx context.Context) {
    for i := 0; i < p.workers; i++ {
        p.wg.Add(1)
        go p.worker(ctx)
    }
}
```

Claude Code 協助：

```javascript
// 審查併發程式碼
await Task({
  subagent_type: "code-reviewer",
  description: "審查併發安全",
  prompt: "檢查 goroutine 洩漏、race conditions、正確的 channel 關閉"
});

// 生成併發測試
await Task({
  subagent_type: "test-generator",
  description: "生成併發測試",
  prompt: "生成測試 race conditions 和 goroutine 安全性的測試"
});
```

## 🛠️ Go 專屬工具整合

### 1. golangci-lint 配置

```yaml
# .golangci.yml
linters:
  enable:
    - gofmt
    - goimports
    - govet
    - errcheck
    - staticcheck
    - gosimple
    - ineffassign
    - unused
    - misspell

linters-settings:
  gofmt:
    simplify: true
  goimports:
    local-prefixes: github.com/your-org/
```

### 2. Makefile 整合

```makefile
# Makefile
.PHONY: test lint build run

test:
	go test -v -race -cover ./...

lint:
	golangci-lint run

build:
	go build -o bin/app main.go

run:
	go run main.go

bench:
	go test -bench=. -benchmem ./...
```

### 3. 測試覆蓋率報告

```bash
# 生成覆蓋率報告
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html
```

## 📊 Go 專案的 Agent 協作

### test-generator for Go
- 生成表格驅動測試
- 創建 Mock 介面
- 生成基準測試
- 生成模糊測試（Go 1.18+）

### code-reviewer for Go
- 檢查錯誤處理模式
- 驗證 goroutine 安全性
- 檢查資源洩漏
- 確認 defer 使用正確

### database-optimizer for Go
- 優化 GORM 查詢
- 設計資料庫索引
- 實作連接池配置
- 優化批次操作

## 🔍 常見 Go 專案問題

### Q: 如何處理依賴管理？
```bash
# 更新依賴
go get -u ./...

# 清理未使用的依賴
go mod tidy

# 下載依賴到 vendor
go mod vendor
```

### Q: 如何在 Claude Code 中除錯 Go？
```javascript
// 使用 delve 除錯器
await Bash({
  command: "dlv debug main.go",
  description: "啟動 delve 除錯器"
});

// 或使用 VS Code 除錯配置
await Task({
  subagent_type: "general-purpose",
  description: "設定除錯",
  prompt: "生成 VS Code 的 launch.json 配置用於除錯 Go 應用"
});
```

### Q: 如何優化 Go 效能？
```javascript
// 執行基準測試
await Bash({
  command: "go test -bench=. -benchmem -cpuprofile cpu.prof ./...",
  description: "執行效能分析"
});

// 分析結果
await Bash({
  command: "go tool pprof cpu.prof",
  description: "分析 CPU 使用"
});
```

## ✅ Go 專案檢查清單

使用框架前確保：
- [ ] 安裝 Go 1.19 或更高版本
- [ ] 專案有 go.mod 檔案
- [ ] 安裝 golangci-lint: `go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest`
- [ ] 安裝 goimports: `go install golang.org/x/tools/cmd/goimports@latest`
- [ ] （可選）安裝 delve: `go install github.com/go-delve/delve/cmd/dlv@latest`

## 🚀 立即開始

```bash
# 1. 在你的 Go 專案執行
cd your-go-project

# 2. 執行設定腳本
./setup-framework.sh

# 3. 啟動 Claude Code
claude

# 4. 初始化（在 Claude Code 中）
await mcp__task-manager__create_task({
  title: "Go 專案初始化",
  priority: "high",
  tags: ["golang", "setup"]
});

console.log("✅ Go 專案框架已就緒！");
```

---

**需要更多幫助？**
- 查看 [Effective Go](https://go.dev/doc/effective_go)
- 參考 [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- 使用 `go doc` 查詢文檔

*Happy Coding with Go and Claude Code! 🐹*