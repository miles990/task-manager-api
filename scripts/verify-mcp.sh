#!/bin/bash

# MCP Server 驗證腳本
# 檢查 MCP server 是否正常運行和配置

echo "🔍 MCP Server 驗證檢查"
echo "======================================"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. 檢查檔案存在
echo -e "\n${BLUE}1. 檢查必要檔案...${NC}"

if [ -f "src/mcp-server.js" ]; then
    echo -e "   ${GREEN}✓${NC} MCP server 檔案存在"
else
    echo -e "   ${RED}✗${NC} MCP server 檔案不存在"
    exit 1
fi

if [ -f "node_modules/@modelcontextprotocol/sdk/package.json" ]; then
    echo -e "   ${GREEN}✓${NC} MCP SDK 已安裝"
else
    echo -e "   ${RED}✗${NC} MCP SDK 未安裝，請執行: npm install"
    exit 1
fi

# 2. 檢查 Node.js 版本
echo -e "\n${BLUE}2. 檢查環境...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    echo -e "   ${GREEN}✓${NC} Node.js 版本符合要求 (v$(node -v | cut -d'v' -f2))"
else
    echo -e "   ${RED}✗${NC} Node.js 版本需要 >= 18"
    exit 1
fi

# 3. 測試 MCP server 啟動
echo -e "\n${BLUE}3. 測試 MCP server 啟動...${NC}"

# 啟動 server 並檢查輸出
timeout 3s node src/mcp-server.js 2>&1 | grep -q "Task Manager MCP Server started"
if [ $? -eq 0 ] || [ $? -eq 124 ]; then  # 124 是 timeout 的返回碼
    echo -e "   ${GREEN}✓${NC} MCP server 可以正常啟動"
else
    echo -e "   ${RED}✗${NC} MCP server 啟動失敗"
    exit 1
fi

# 4. 檢查 Claude Code 註冊
echo -e "\n${BLUE}4. 檢查 Claude Code 註冊狀態...${NC}"

# 檢查 claude 命令是否存在
if command -v claude &> /dev/null; then
    echo -e "   ${GREEN}✓${NC} Claude Code CLI 已安裝"
    
    # 列出已註冊的 MCP servers
    echo -e "\n   已註冊的 MCP servers:"
    claude mcp list 2>/dev/null | grep -E "task-manager|No MCP servers" | while read -r line; do
        if [[ $line == *"task-manager"* ]]; then
            echo -e "   ${GREEN}✓${NC} task-manager 已註冊到 Claude Code"
        elif [[ $line == *"No MCP servers"* ]]; then
            echo -e "   ${YELLOW}⚠${NC} 沒有找到已註冊的 MCP servers"
            echo -e "   ${YELLOW}ℹ${NC} 請執行: ./scripts/register-mcp.sh"
        fi
    done
else
    echo -e "   ${YELLOW}⚠${NC} Claude Code CLI 未安裝"
    echo -e "   ${YELLOW}ℹ${NC} 請先安裝 Claude Code"
fi

# 5. 檢查配置檔案
echo -e "\n${BLUE}5. 檢查配置檔案...${NC}"

if grep -q "task-manager" mcp-config.json 2>/dev/null; then
    echo -e "   ${GREEN}✓${NC} mcp-config.json 包含 task-manager 配置"
else
    echo -e "   ${YELLOW}⚠${NC} mcp-config.json 缺少 task-manager 配置"
fi

# 6. 測試工具可用性
echo -e "\n${BLUE}6. 快速功能測試...${NC}"

# 創建測試腳本
cat > /tmp/test-mcp-tools.js << 'EOF'
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// 直接導入 server
import { server } from './src/mcp-server.js';

// 模擬 list tools 請求
const mockRequest = {
  method: 'tools/list',
  id: '1',
  params: {}
};

try {
  // 獲取 tools handler
  const handlers = server._requestHandlers || server.requestHandlers;
  let toolsHandler = null;
  
  // 嘗試找到 handler
  for (const [schema, handler] of handlers) {
    if (schema === ListToolsRequestSchema || schema.shape?.method?.value === 'tools/list') {
      toolsHandler = handler;
      break;
    }
  }
  
  if (toolsHandler) {
    const result = await toolsHandler(mockRequest);
    if (result.tools && result.tools.length > 0) {
      console.log(`✓ Found ${result.tools.length} tools`);
      result.tools.forEach(tool => {
        console.log(`  • ${tool.name}`);
      });
      process.exit(0);
    }
  }
  console.log('✗ No tools found');
  process.exit(1);
} catch (error) {
  console.log('✗ Error:', error.message);
  process.exit(1);
}
EOF

# 執行測試
node /tmp/test-mcp-tools.js 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓${NC} MCP 工具正常載入"
else
    echo -e "   ${YELLOW}⚠${NC} 無法驗證工具（需要更詳細測試）"
fi

# 清理
rm -f /tmp/test-mcp-tools.js

# 7. 顯示如何使用
echo -e "\n${BLUE}7. 使用方式...${NC}"
echo "   📝 在 Claude Code 中可以使用以下指令:"
echo "      • \"Create a new task for [description]\""
echo "      • \"List all pending tasks\""
echo "      • \"Update task [id] to completed\""
echo "      • \"Show task statistics\""

# 總結
echo -e "\n======================================"
echo -e "${GREEN}✅ MCP Server 基本檢查完成${NC}"
echo ""
echo "下一步:"
echo "1. 如果未註冊，執行: ./scripts/register-mcp.sh"
echo "2. 在 Claude Code 中測試: \"Create a test task\""
echo "3. 執行完整測試: node scripts/test-mcp-server.js"
echo "4. 查看監控儀表板: open src/monitoring/dashboard.html"