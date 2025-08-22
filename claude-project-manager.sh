#!/bin/bash

# ============================================
# Claude Code 專案管理器
# 管理多個專案的 Claude Code 配置
# ============================================

set -e

# 配置檔路徑
CONFIG_DIR="$HOME/.claude"
PROJECTS_FILE="$CONFIG_DIR/projects.json"
CURRENT_PROJECT_FILE="$CONFIG_DIR/current_project"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 確保配置目錄存在
ensure_config_dir() {
    if [ ! -d "$CONFIG_DIR" ]; then
        mkdir -p "$CONFIG_DIR"
        echo "{}" > "$PROJECTS_FILE"
        echo -e "${GREEN}✅ 建立配置目錄: $CONFIG_DIR${NC}"
    fi
}

# 顯示標題
show_header() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════╗"
    echo "║       Claude Code 專案管理器 v1.0         ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 添加專案
add_project() {
    local name=$1
    local path=$2
    
    # 如果沒有提供參數，使用互動模式
    if [ -z "$name" ]; then
        echo -e "${YELLOW}請輸入專案名稱:${NC}"
        read -p "> " name
    fi
    
    if [ -z "$path" ]; then
        echo -e "${YELLOW}請輸入專案路徑 (預設: 當前目錄):${NC}"
        read -p "> " path
        path=${path:-$(pwd)}
    fi
    
    # 轉換為絕對路徑
    path=$(cd "$path" 2>/dev/null && pwd || echo "$path")
    
    # 檢查路徑是否存在
    if [ ! -d "$path" ]; then
        echo -e "${RED}❌ 路徑不存在: $path${NC}"
        return 1
    fi
    
    # 檢測專案類型
    local project_type="unknown"
    if [ -f "$path/go.mod" ]; then
        project_type="go"
    elif [ -f "$path/package.json" ]; then
        project_type="node"
    elif [ -f "$path/requirements.txt" ] || [ -f "$path/setup.py" ]; then
        project_type="python"
    elif [ -f "$path/Cargo.toml" ]; then
        project_type="rust"
    elif [ -f "$path/pom.xml" ] || [ -f "$path/build.gradle" ]; then
        project_type="java"
    fi
    
    # 更新 projects.json
    if [ -f "$PROJECTS_FILE" ]; then
        # 使用 Python 更新 JSON（更可靠）
        python3 -c "
import json
import sys

with open('$PROJECTS_FILE', 'r') as f:
    projects = json.load(f)

projects['$name'] = {
    'path': '$path',
    'type': '$project_type',
    'created': '$(date +%Y-%m-%d)',
    'last_used': '$(date +%Y-%m-%d)'
}

with open('$PROJECTS_FILE', 'w') as f:
    json.dump(projects, f, indent=2)
"
    fi
    
    echo -e "${GREEN}✅ 專案已添加:${NC}"
    echo -e "  名稱: ${BLUE}$name${NC}"
    echo -e "  路徑: ${BLUE}$path${NC}"
    echo -e "  類型: ${BLUE}$project_type${NC}"
    
    # 詢問是否立即初始化
    echo -e "${YELLOW}是否要為此專案初始化 Claude Code 框架? (y/n)${NC}"
    read -p "> " init_now
    if [ "$init_now" = "y" ]; then
        init_project "$name"
    fi
}

# 列出所有專案
list_projects() {
    if [ ! -f "$PROJECTS_FILE" ]; then
        echo -e "${YELLOW}尚未添加任何專案${NC}"
        return
    fi
    
    echo -e "${CYAN}已配置的專案:${NC}"
    echo ""
    
    # 使用 Python 解析 JSON
    python3 -c "
import json
import os

with open('$PROJECTS_FILE', 'r') as f:
    projects = json.load(f)

current = None
if os.path.exists('$CURRENT_PROJECT_FILE'):
    with open('$CURRENT_PROJECT_FILE', 'r') as f:
        current = f.read().strip()

for name, info in projects.items():
    marker = '* ' if name == current else '  '
    print(f\"{marker}{name}\")
    print(f\"    路徑: {info['path']}\")
    print(f\"    類型: {info['type']}\")
    print(f\"    建立: {info.get('created', 'N/A')}\")
    print()
"
}

# 切換專案
switch_project() {
    local name=$1
    
    if [ -z "$name" ]; then
        # 顯示選單
        echo -e "${CYAN}選擇要切換的專案:${NC}"
        list_projects
        echo -e "${YELLOW}請輸入專案名稱:${NC}"
        read -p "> " name
    fi
    
    # 檢查專案是否存在
    local project_path=$(python3 -c "
import json
try:
    with open('$PROJECTS_FILE', 'r') as f:
        projects = json.load(f)
    if '$name' in projects:
        print(projects['$name']['path'])
except:
    pass
")
    
    if [ -z "$project_path" ]; then
        echo -e "${RED}❌ 專案不存在: $name${NC}"
        return 1
    fi
    
    # 更新當前專案
    echo "$name" > "$CURRENT_PROJECT_FILE"
    
    # 更新 last_used
    python3 -c "
import json
with open('$PROJECTS_FILE', 'r') as f:
    projects = json.load(f)
projects['$name']['last_used'] = '$(date +%Y-%m-%d)'
with open('$PROJECTS_FILE', 'w') as f:
    json.dump(projects, f, indent=2)
"
    
    echo -e "${GREEN}✅ 已切換到專案: $name${NC}"
    echo -e "  路徑: ${BLUE}$project_path${NC}"
    
    # 顯示專案狀態
    if [ -f "$project_path/CLAUDE.md" ]; then
        echo -e "  ${GREEN}✓${NC} CLAUDE.md 已配置"
    else
        echo -e "  ${YELLOW}!${NC} CLAUDE.md 未配置"
    fi
    
    # 建立符號連結（可選）
    CLAUDE_WORKSPACE="$HOME/.claude/current"
    if [ -L "$CLAUDE_WORKSPACE" ]; then
        rm "$CLAUDE_WORKSPACE"
    fi
    ln -sf "$project_path" "$CLAUDE_WORKSPACE"
    echo -e "  ${BLUE}→${NC} 符號連結: ~/.claude/current"
}

# 初始化專案
init_project() {
    local name=$1
    
    if [ -z "$name" ]; then
        # 使用當前專案
        if [ -f "$CURRENT_PROJECT_FILE" ]; then
            name=$(cat "$CURRENT_PROJECT_FILE")
        else
            echo -e "${RED}❌ 沒有選擇專案${NC}"
            return 1
        fi
    fi
    
    # 獲取專案路徑
    local project_path=$(python3 -c "
import json
with open('$PROJECTS_FILE', 'r') as f:
    projects = json.load(f)
if '$name' in projects:
    print(projects['$name']['path'])
")
    
    if [ -z "$project_path" ]; then
        echo -e "${RED}❌ 專案不存在: $name${NC}"
        return 1
    fi
    
    echo -e "${CYAN}初始化專案: $name${NC}"
    echo -e "路徑: $project_path"
    
    # 執行設定腳本
    if [ -f "./setup-framework.sh" ]; then
        ./setup-framework.sh "$project_path"
    else
        echo -e "${YELLOW}下載設定腳本...${NC}"
        curl -sSL https://raw.githubusercontent.com/your-repo/setup-framework.sh -o /tmp/setup-framework.sh
        bash /tmp/setup-framework.sh "$project_path"
    fi
}

# 移除專案
remove_project() {
    local name=$1
    
    if [ -z "$name" ]; then
        echo -e "${YELLOW}請輸入要移除的專案名稱:${NC}"
        read -p "> " name
    fi
    
    # 使用 Python 移除專案
    python3 -c "
import json
with open('$PROJECTS_FILE', 'r') as f:
    projects = json.load(f)
if '$name' in projects:
    del projects['$name']
    with open('$PROJECTS_FILE', 'w') as f:
        json.dump(projects, f, indent=2)
    print('removed')
" | grep -q "removed"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 專案已移除: $name${NC}"
        
        # 如果是當前專案，清除
        if [ -f "$CURRENT_PROJECT_FILE" ]; then
            current=$(cat "$CURRENT_PROJECT_FILE")
            if [ "$current" = "$name" ]; then
                rm "$CURRENT_PROJECT_FILE"
            fi
        fi
    else
        echo -e "${RED}❌ 專案不存在: $name${NC}"
    fi
}

# 顯示當前專案
show_current() {
    if [ ! -f "$CURRENT_PROJECT_FILE" ]; then
        echo -e "${YELLOW}尚未選擇專案${NC}"
        echo -e "使用 ${BLUE}$0 switch${NC} 選擇專案"
        return
    fi
    
    local current=$(cat "$CURRENT_PROJECT_FILE")
    local project_info=$(python3 -c "
import json
with open('$PROJECTS_FILE', 'r') as f:
    projects = json.load(f)
if '$current' in projects:
    info = projects['$current']
    print(f\"名稱: $current\")
    print(f\"路徑: {info['path']}\")
    print(f\"類型: {info['type']}\")
    print(f\"最後使用: {info.get('last_used', 'N/A')}\")
")
    
    echo -e "${CYAN}當前專案:${NC}"
    echo "$project_info"
}

# 開啟專案
open_project() {
    local name=$1
    
    if [ -z "$name" ]; then
        if [ -f "$CURRENT_PROJECT_FILE" ]; then
            name=$(cat "$CURRENT_PROJECT_FILE")
        else
            echo -e "${RED}❌ 沒有選擇專案${NC}"
            return 1
        fi
    fi
    
    local project_path=$(python3 -c "
import json
with open('$PROJECTS_FILE', 'r') as f:
    projects = json.load(f)
if '$name' in projects:
    print(projects['$name']['path'])
")
    
    if [ -z "$project_path" ]; then
        echo -e "${RED}❌ 專案不存在: $name${NC}"
        return 1
    fi
    
    echo -e "${GREEN}開啟專案: $name${NC}"
    echo -e "路徑: $project_path"
    
    # 切換到專案目錄並啟動 Claude Code
    cd "$project_path"
    
    # 如果有 CLAUDE.md，顯示提示
    if [ -f "CLAUDE.md" ]; then
        echo -e "${GREEN}✅ CLAUDE.md 已配置${NC}"
    else
        echo -e "${YELLOW}⚠️  CLAUDE.md 未配置，建議執行初始化${NC}"
    fi
    
    # 啟動 Claude Code
    echo -e "${CYAN}啟動 Claude Code...${NC}"
    claude
}

# 顯示幫助
show_help() {
    echo -e "${CYAN}使用方式:${NC}"
    echo "  $0 add [name] [path]     - 添加專案"
    echo "  $0 list                   - 列出所有專案"
    echo "  $0 switch [name]          - 切換專案"
    echo "  $0 current                - 顯示當前專案"
    echo "  $0 init [name]            - 初始化專案框架"
    echo "  $0 remove [name]          - 移除專案"
    echo "  $0 open [name]            - 開啟專案並啟動 Claude"
    echo "  $0 help                   - 顯示幫助"
    echo ""
    echo -e "${YELLOW}範例:${NC}"
    echo "  $0 add myapp /path/to/myapp"
    echo "  $0 switch myapp"
    echo "  $0 init"
    echo "  $0 open"
}

# 主程式
main() {
    ensure_config_dir
    
    case "$1" in
        add)
            show_header
            add_project "$2" "$3"
            ;;
        list|ls)
            show_header
            list_projects
            ;;
        switch|use)
            show_header
            switch_project "$2"
            ;;
        current|cur)
            show_header
            show_current
            ;;
        init)
            show_header
            init_project "$2"
            ;;
        remove|rm)
            show_header
            remove_project "$2"
            ;;
        open|start)
            show_header
            open_project "$2"
            ;;
        help|--help|-h)
            show_header
            show_help
            ;;
        *)
            show_header
            if [ -z "$1" ]; then
                show_current
                echo ""
                show_help
            else
                echo -e "${RED}未知命令: $1${NC}"
                show_help
            fi
            ;;
    esac
}

# 執行主程式
main "$@"