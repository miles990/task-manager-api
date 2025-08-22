#!/bin/bash

# ============================================
# Claude Code 自動化框架快速部署腳本
# ============================================
# 使用方式:
# curl -sSL https://your-repo/setup-framework.sh | bash
# 或
# ./setup-framework.sh [專案路徑]
# ============================================

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 圖標
CHECK_MARK="✅"
CROSS_MARK="❌"
ARROW="➜"
ROCKET="🚀"

# 函數：顯示標題
show_header() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════╗"
    echo "║     Claude Code 自動化框架安裝程式        ║"
    echo "║         快速部署 AI 輔助開發環境          ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 函數：顯示進度
show_progress() {
    echo -e "${YELLOW}${ARROW}${NC} $1..."
}

# 函數：顯示成功
show_success() {
    echo -e "${GREEN}${CHECK_MARK}${NC} $1"
}

# 函數：顯示錯誤
show_error() {
    echo -e "${RED}${CROSS_MARK}${NC} $1"
    exit 1
}

# 函數：詢問用戶
ask_user() {
    echo -e "${YELLOW}?${NC} $1"
    read -p "$ARROW " response
    echo "$response"
}

# 函數：檢測專案類型
detect_project_type() {
    local project_path=$1
    
    if [ -f "$project_path/package.json" ]; then
        echo "node"
    elif [ -f "$project_path/requirements.txt" ] || [ -f "$project_path/setup.py" ]; then
        echo "python"
    elif [ -f "$project_path/go.mod" ]; then
        echo "go"
    elif [ -f "$project_path/Cargo.toml" ]; then
        echo "rust"
    elif [ -f "$project_path/pom.xml" ] || [ -f "$project_path/build.gradle" ]; then
        echo "java"
    else
        echo "unknown"
    fi
}

# 函數：生成 CLAUDE.md
generate_claude_md() {
    local project_name=$1
    local project_type=$2
    local project_path=$3
    
    cat > "$project_path/CLAUDE.md" << 'EOF'
# CLAUDE.md - PROJECT_NAME

這個檔案為 Claude Code 提供專案特定的指引和上下文。

## 專案概述

專案名稱：PROJECT_NAME
專案類型：PROJECT_TYPE
建立日期：CURRENT_DATE

## 技術棧
TECH_STACK

## 開發指引

### 程式碼風格
CODE_STYLE

### 錯誤處理
- 使用集中式錯誤處理
- 適當的錯誤訊息和日誌
- 優雅的降級處理

### 測試要求
- 新功能必須包含測試
- 測試覆蓋率保持在 80% 以上
TEST_COMMANDS

## Claude Code 工作流程

### 1. 實作新功能時
```
1. 先使用 TodoWrite 工具規劃任務
2. 查看現有程式碼結構和模式
3. 實作功能
4. 【自動】使用 test-generator sub-agent 生成測試
5. 【自動】使用 code-reviewer sub-agent 審查程式碼
6. 【自動】運行測試和 lint
7. 【自動】如果有錯誤，立即修復並重新測試
```

### 2. 修復錯誤時
```
1. 重現錯誤並理解根本原因
2. 編寫失敗的測試案例
3. 修復錯誤使測試通過
4. 【自動】運行測試確保其他測試仍然通過
5. 【自動】使用 code-reviewer sub-agent 審查修復
```

## MCP-Agent 智能協作系統

### 🤖 Agent + MCP 自動化矩陣

| Agent | MCP 整合 | 自動觸發時機 | 協作流程 |
|-------|----------|-------------|----------|
| **task-manager-specialist** | `mcp__task-manager__*` | 每次開始新工作 | 創建任務 → 追蹤進度 → 更新狀態 |
| **code-reviewer** | `mcp__task-manager__update_task` | 完成功能後 | 審查 → 記錄問題 → 更新任務 |
| **test-generator** | `mcp__task-manager__create_task` | 新增功能時 | 生成測試 → 創建測試任務 |
| **api-documenter** | `mcp__task-manager__update_task` | API 變更後 | 更新文檔 → 標記任務完成 |

### 🔄 智能工作流程

#### 新功能開發（全自動）
```yaml
觸發: 使用者要求新功能
執行順序:
  1. task-manager-specialist:
     - 調用 mcp__task-manager__create_task
     - 設定 priority 和 tags
  2. TodoWrite:
     - 同步創建本地任務清單
  3. 實作功能:
     - 編寫程式碼
  4. test-generator:
     - 自動生成測試
  5. code-reviewer:
     - 審查程式碼
  6. 完成:
     - 更新任務狀態
     - 生成報告
```

## MCP 任務管理快速指令

```javascript
// 創建任務
mcp__task-manager__create_task({
  title: "任務名稱",
  priority: "high",
  tags: ["feature"]
})

// 列出任務
mcp__task-manager__list_tasks()

// 更新任務
mcp__task-manager__update_task(id, {
  updates: { status: "completed" }
})

// 查看統計
mcp__task-manager__get_task_stats()
```

## 自動化執行規則

### 自動檢查點
1. **每次修改程式碼後自動執行：**
   - LINT_COMMAND
   - TEST_COMMAND
   - 如果失敗，立即修復

2. **每次完成功能後自動執行：**
   - 運行所有測試
   - 觸發 test-generator 補充測試
   - 觸發 code-reviewer 審查程式碼

### Agent 自動決策流程
當使用者提出需求時，依照以下順序自動決定：

1. **分析需求類型：**
   - 🔧 **修復類** → 【MCP】create_task(bug) → 修復 → 測試 → 完成
   - ✨ **新功能** → 【MCP】create_task(feature) → 實作 → 測試 → 文檔 → 完成
   - ♻️ **重構類** → 【MCP】create_task(refactor) → 分析 → 重構 → 測試 → 完成
   - 📚 **文檔類** → api-documenter → 更新文檔
   - 🔍 **查詢類** → grep/glob 搜尋 → 【MCP】list_tasks

## 常用命令

```bash
# 開發
DEV_COMMAND

# 測試
TEST_COMMAND

# 程式碼品質
LINT_COMMAND
FORMAT_COMMAND

# 建構
BUILD_COMMAND
```

## 專案特定規則

PROJECT_SPECIFIC_RULES

---

**核心原則：**
- 主動執行檢查，不等使用者要求
- 平行處理提升效率
- 失敗立即修復，不累積技術債
- 每個操作都要有對應的測試和文檔

**記住：始終優先考慮程式碼品質、測試覆蓋和文檔完整性。**
EOF
    
    # 根據專案類型替換內容
    local tech_stack=""
    local code_style=""
    local test_commands=""
    local lint_command=""
    local test_command=""
    local dev_command=""
    local format_command=""
    local build_command=""
    
    case $project_type in
        "node")
            tech_stack="- 語言: JavaScript/TypeScript\n- 執行環境: Node.js\n- 套件管理: npm/yarn"
            code_style="- 使用 ES6+ 語法\n- 遵循 Airbnb JavaScript 風格指南\n- 使用 async/await 處理非同步"
            test_commands="- 測試框架: Jest/Mocha/Node Test Runner"
            lint_command="npm run lint"
            test_command="npm test"
            dev_command="npm run dev"
            format_command="npm run format"
            build_command="npm run build"
            ;;
        "python")
            tech_stack="- 語言: Python 3.x\n- 套件管理: pip/poetry\n- 虛擬環境: venv"
            code_style="- 遵循 PEP 8\n- 使用 type hints\n- 使用 Black 格式化"
            test_commands="- 測試框架: pytest/unittest"
            lint_command="flake8 ."
            test_command="pytest"
            dev_command="python main.py"
            format_command="black ."
            build_command="python setup.py build"
            ;;
        *)
            tech_stack="- 語言: [請填寫]\n- 框架: [請填寫]\n- 資料庫: [請填寫]"
            code_style="- [請填寫程式碼規範]"
            test_commands="- [請填寫測試框架]"
            lint_command="[請填寫 lint 命令]"
            test_command="[請填寫測試命令]"
            dev_command="[請填寫開發命令]"
            format_command="[請填寫格式化命令]"
            build_command="[請填寫建構命令]"
            ;;
    esac
    
    # 替換佔位符
    sed -i.bak "s/PROJECT_NAME/$project_name/g" "$project_path/CLAUDE.md"
    sed -i.bak "s/PROJECT_TYPE/$project_type/g" "$project_path/CLAUDE.md"
    sed -i.bak "s/CURRENT_DATE/$(date +%Y-%m-%d)/g" "$project_path/CLAUDE.md"
    sed -i.bak "s|TECH_STACK|$tech_stack|g" "$project_path/CLAUDE.md"
    sed -i.bak "s|CODE_STYLE|$code_style|g" "$project_path/CLAUDE.md"
    sed -i.bak "s|TEST_COMMANDS|$test_commands|g" "$project_path/CLAUDE.md"
    sed -i.bak "s|LINT_COMMAND|$lint_command|g" "$project_path/CLAUDE.md"
    sed -i.bak "s|TEST_COMMAND|$test_command|g" "$project_path/CLAUDE.md"
    sed -i.bak "s|DEV_COMMAND|$dev_command|g" "$project_path/CLAUDE.md"
    sed -i.bak "s|FORMAT_COMMAND|$format_command|g" "$project_path/CLAUDE.md"
    sed -i.bak "s|BUILD_COMMAND|$build_command|g" "$project_path/CLAUDE.md"
    sed -i.bak "s|PROJECT_SPECIFIC_RULES|# 請根據專案需求添加特定規則|g" "$project_path/CLAUDE.md"
    
    # 刪除備份檔案
    rm -f "$project_path/CLAUDE.md.bak"
}

# 函數：生成 MCP 配置
generate_mcp_config() {
    local project_path=$1
    local project_name=$2
    
    cat > "$project_path/mcp-config.json" << EOF
{
  "mcpServers": {
    "$project_name": {
      "command": "node",
      "args": ["src/mcp-server.js"],
      "scope": "project",
      "description": "$project_name MCP Server"
    },
    "task-manager": {
      "command": "node",
      "args": ["${FRAMEWORK_PATH}/src/mcp-server.js"],
      "scope": "project",
      "description": "Task Manager MCP Server"
    }
  }
}
EOF
}

# 函數：創建初始化腳本
create_init_script() {
    local project_path=$1
    
    cat > "$project_path/init-claude.js" << 'EOF'
#!/usr/bin/env node

/**
 * Claude Code 框架初始化腳本
 * 在 Claude Code 中執行此腳本來初始化專案
 */

async function initializeProject() {
    console.log("🚀 初始化 Claude Code 框架...");
    
    try {
        // 1. 創建初始任務
        const projectTask = await mcp__task-manager__create_task({
            title: "專案初始化",
            description: "設定 Claude Code 自動化框架",
            priority: "high",
            status: "in_progress",
            tags: ["setup", "framework"]
        });
        
        console.log("✅ 初始任務已創建");
        
        // 2. 設定 TodoWrite
        await TodoWrite([
            { content: "閱讀 CLAUDE.md 了解專案規範", status: "pending" },
            { content: "設定開發環境", status: "pending" },
            { content: "熟悉 MCP 指令", status: "pending" },
            { content: "開始第一個功能開發", status: "pending" }
        ]);
        
        console.log("✅ Todo 清單已設定");
        
        // 3. 檢查專案狀態
        const stats = await mcp__task-manager__get_task_stats();
        
        console.log("\n📊 專案狀態:");
        console.log(`   總任務數: ${stats.total}`);
        console.log(`   進行中: ${stats.in_progress}`);
        console.log(`   待處理: ${stats.pending}`);
        
        // 4. 顯示快速指令
        console.log("\n📝 快速指令參考:");
        console.log("   創建任務: mcp__task-manager__create_task({...})");
        console.log("   列出任務: mcp__task-manager__list_tasks()");
        console.log("   更新任務: mcp__task-manager__update_task(id, {...})");
        console.log("   查看統計: mcp__task-manager__get_task_stats()");
        
        // 5. 觸發 Agent 介紹
        console.log("\n🤖 可用的 Agents:");
        console.log("   - test-generator: 生成測試");
        console.log("   - code-reviewer: 審查程式碼");
        console.log("   - api-documenter: 更新文檔");
        console.log("   - task-manager-specialist: 任務管理");
        
        // 6. 完成初始化
        await mcp__task-manager__update_task(projectTask.id, {
            updates: { 
                status: "completed",
                description: "框架初始化完成，可以開始開發了！"
            }
        });
        
        console.log("\n✅ Claude Code 框架初始化完成！");
        console.log("💡 提示: 查看 CLAUDE.md 了解完整的自動化規則");
        console.log("🚀 現在可以開始使用自動化框架了！");
        
    } catch (error) {
        console.error("❌ 初始化失敗:", error.message);
        console.log("💡 請確保 MCP 服務器正在運行");
    }
}

// 執行初始化
initializeProject();
EOF
    
    chmod +x "$project_path/init-claude.js"
}

# 函數：創建快速命令腳本
create_quick_commands() {
    local project_path=$1
    
    cat > "$project_path/claude-commands.sh" << 'EOF'
#!/bin/bash

# Claude Code 快速命令集合

case "$1" in
    "task")
        echo "創建任務: mcp__task-manager__create_task({title: '$2', priority: 'medium'})"
        ;;
    "list")
        echo "列出任務: mcp__task-manager__list_tasks()"
        ;;
    "stats")
        echo "查看統計: mcp__task-manager__get_task_stats()"
        ;;
    "test")
        echo "生成測試: Task({subagent_type: 'test-generator', description: '生成測試', prompt: '$2'})"
        ;;
    "review")
        echo "審查程式碼: Task({subagent_type: 'code-reviewer', description: '審查', prompt: '審查最近變更'})"
        ;;
    "doc")
        echo "更新文檔: Task({subagent_type: 'api-documenter', description: '文檔', prompt: '更新 API 文檔'})"
        ;;
    *)
        echo "可用命令:"
        echo "  task [名稱]  - 創建任務"
        echo "  list        - 列出任務"
        echo "  stats       - 查看統計"
        echo "  test [描述] - 生成測試"
        echo "  review      - 審查程式碼"
        echo "  doc         - 更新文檔"
        ;;
esac
EOF
    
    chmod +x "$project_path/claude-commands.sh"
}

# 主程式
main() {
    show_header
    
    # 1. 確定專案路徑
    PROJECT_PATH="${1:-$(pwd)}"
    
    if [ ! -d "$PROJECT_PATH" ]; then
        show_error "專案路徑不存在: $PROJECT_PATH"
    fi
    
    show_progress "檢測專案類型"
    PROJECT_TYPE=$(detect_project_type "$PROJECT_PATH")
    show_success "專案類型: $PROJECT_TYPE"
    
    # 2. 詢問專案名稱
    PROJECT_NAME=$(ask_user "請輸入專案名稱 (預設: $(basename $PROJECT_PATH))")
    PROJECT_NAME="${PROJECT_NAME:-$(basename $PROJECT_PATH)}"
    
    # 3. 詢問是否需要 MCP 支援
    NEED_MCP=$(ask_user "是否需要 MCP 任務管理支援? (y/n, 預設: y)")
    NEED_MCP="${NEED_MCP:-y}"
    
    # 4. 生成 CLAUDE.md
    show_progress "生成 CLAUDE.md 配置檔案"
    generate_claude_md "$PROJECT_NAME" "$PROJECT_TYPE" "$PROJECT_PATH"
    show_success "CLAUDE.md 已生成"
    
    # 5. 生成 MCP 配置（如果需要）
    if [ "$NEED_MCP" = "y" ]; then
        show_progress "生成 MCP 配置"
        generate_mcp_config "$PROJECT_PATH" "$PROJECT_NAME"
        show_success "MCP 配置已生成"
    fi
    
    # 6. 創建初始化腳本
    show_progress "創建初始化腳本"
    create_init_script "$PROJECT_PATH"
    show_success "初始化腳本已創建"
    
    # 7. 創建快速命令
    show_progress "創建快速命令工具"
    create_quick_commands "$PROJECT_PATH"
    show_success "快速命令工具已創建"
    
    # 8. 創建 .claudeignore（如果不存在）
    if [ ! -f "$PROJECT_PATH/.claudeignore" ]; then
        show_progress "創建 .claudeignore"
        cat > "$PROJECT_PATH/.claudeignore" << 'EOF'
# Claude Code 忽略檔案
node_modules/
.git/
dist/
build/
*.log
.env
.DS_Store
coverage/
*.pyc
__pycache__/
EOF
        show_success ".claudeignore 已創建"
    fi
    
    # 完成
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          ${ROCKET} 安裝完成！${ROCKET}              ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo "已創建的檔案:"
    echo "  • CLAUDE.md - 專案配置和自動化規則"
    [ "$NEED_MCP" = "y" ] && echo "  • mcp-config.json - MCP 服務器配置"
    echo "  • init-claude.js - 初始化腳本"
    echo "  • claude-commands.sh - 快速命令工具"
    echo "  • .claudeignore - 忽略檔案配置"
    echo ""
    echo -e "${YELLOW}下一步:${NC}"
    echo "1. 啟動 Claude Code:"
    echo "   $ claude"
    echo ""
    echo "2. 在 Claude Code 中執行初始化:"
    echo "   $ node init-claude.js"
    echo ""
    echo "3. 或直接複製以下程式碼到 Claude Code:"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    cat << 'EOF'
// 初始化專案
await mcp__task-manager__create_task({
  title: "開始開發",
  priority: "high",
  status: "in_progress"
});
console.log("✅ 專案已準備就緒！");
EOF
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}Happy Coding with Claude Code! 🎉${NC}"
}

# 設定框架路徑（根據實際情況調整）
FRAMEWORK_PATH="/Users/user/Workspace/task-manager-api"

# 執行主程式
main "$@"