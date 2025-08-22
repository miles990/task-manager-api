#!/usr/bin/env node

/**
 * MCP Server 測試腳本
 * 用於驗證 MCP server 是否正常運行
 */

const { spawn } = require('child_process');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testMCPServer() {
  log('\n🔍 Testing Task Manager MCP Server...', 'bright');
  log('=' .repeat(50));

  try {
    // 1. 啟動 MCP server 作為子進程
    log('\n1️⃣ Starting MCP server...', 'cyan');
    const serverProcess = spawn('node', ['src/mcp-server.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    // 監聽錯誤
    serverProcess.stderr.on('data', (data) => {
      const message = data.toString();
      if (message.includes('started')) {
        log('   ✅ Server started successfully', 'green');
      }
    });

    // 給 server 一些時間啟動
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. 創建 MCP client
    log('\n2️⃣ Creating MCP client...', 'cyan');
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['src/mcp-server.js'],
    });

    const client = new Client({
      name: 'test-client',
      version: '1.0.0',
    }, {
      capabilities: {}
    });

    await client.connect(transport);
    log('   ✅ Client connected', 'green');

    // 3. 列出可用工具
    log('\n3️⃣ Listing available tools...', 'cyan');
    const tools = await client.listTools();
    log(`   ✅ Found ${tools.tools.length} tools:`, 'green');
    tools.tools.forEach(tool => {
      log(`      • ${tool.name}: ${tool.description}`, 'blue');
    });

    // 4. 測試創建任務
    log('\n4️⃣ Testing create_task...', 'cyan');
    const createResult = await client.callTool('create_task', {
      title: 'Test Task from MCP',
      description: 'This is a test task created via MCP',
      priority: 'high',
      tags: ['test', 'mcp']
    });
    log('   ✅ Task created successfully:', 'green');
    log(`      ${createResult.content[0].text}`, 'blue');

    // 5. 測試列出任務
    log('\n5️⃣ Testing list_tasks...', 'cyan');
    const listResult = await client.callTool('list_tasks', {
      status: 'pending'
    });
    log('   ✅ Tasks listed successfully:', 'green');
    log(`      ${listResult.content[0].text}`, 'blue');

    // 6. 測試獲取統計
    log('\n6️⃣ Testing get_task_stats...', 'cyan');
    const statsResult = await client.callTool('get_task_stats', {});
    log('   ✅ Statistics retrieved successfully:', 'green');
    log(`      ${statsResult.content[0].text}`, 'blue');

    // 清理
    log('\n7️⃣ Cleaning up...', 'cyan');
    await client.close();
    serverProcess.kill();
    log('   ✅ Test completed successfully!', 'green');

    log('\n' + '=' .repeat(50));
    log('✨ All MCP tests passed!', 'bright');
    log('=' .repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    log(`\n❌ Test failed: ${error.message}`, 'red');
    if (error.stack) {
      log(error.stack, 'red');
    }
    process.exit(1);
  }
}

// 執行測試
testMCPServer().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});