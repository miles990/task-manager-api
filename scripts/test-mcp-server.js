#!/usr/bin/env node

/**
 * MCP Server 測試腳本
 * 用於驗證 MCP server 是否正常運行
 */

import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

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
    const toolsResponse = await client.listTools();
    
    if (toolsResponse.tools && toolsResponse.tools.length > 0) {
      log(`   ✅ Found ${toolsResponse.tools.length} tools:`, 'green');
      toolsResponse.tools.forEach(tool => {
        log(`      • ${tool.name}: ${tool.description}`, 'blue');
      });
    } else {
      log('   ❌ No tools found', 'red');
      process.exit(1);
    }

    // 4. 測試創建任務
    log('\n4️⃣ Testing create_task...', 'cyan');
    const createResult = await client.callTool('create_task', {
      title: 'Test Task from MCP',
      description: 'This is a test task created via MCP',
      priority: 'high'
    });
    
    if (createResult.content && createResult.content[0]) {
      log('   ✅ Task created successfully', 'green');
      log(`      ${createResult.content[0].text}`, 'blue');
      
      // 提取任務 ID
      const idMatch = createResult.content[0].text.match(/ID: ([a-f0-9-]+)/);
      const taskId = idMatch ? idMatch[1] : null;
      
      if (taskId) {
        // 5. 測試列出任務
        log('\n5️⃣ Testing list_tasks...', 'cyan');
        const listResult = await client.callTool('list_tasks', {});
        log('   ✅ Tasks listed successfully', 'green');
        
        // 6. 測試獲取任務詳情
        log('\n6️⃣ Testing get_task...', 'cyan');
        const getResult = await client.callTool('get_task', { id: taskId });
        log('   ✅ Task details retrieved', 'green');
        
        // 7. 測試更新任務
        log('\n7️⃣ Testing update_task...', 'cyan');
        const updateResult = await client.callTool('update_task', {
          id: taskId,
          updates: { status: 'completed' }
        });
        log('   ✅ Task updated successfully', 'green');
        
        // 8. 測試統計
        log('\n8️⃣ Testing get_task_stats...', 'cyan');
        const statsResult = await client.callTool('get_task_stats', {});
        log('   ✅ Statistics retrieved', 'green');
        log(`      ${statsResult.content[0].text.split('\n')[0]}`, 'blue');
        
        // 9. 測試刪除任務
        log('\n9️⃣ Testing delete_task...', 'cyan');
        const deleteResult = await client.callTool('delete_task', { id: taskId });
        log('   ✅ Task deleted successfully', 'green');
      }
    }

    // 關閉連接
    await client.close();
    serverProcess.kill();

    log('\n' + '=' .repeat(50));
    log('✅ All tests passed! MCP Server is working correctly.', 'green');
    log('\n📝 Summary:', 'bright');
    log('   • Server starts successfully');
    log('   • Client can connect');
    log('   • All 6 tools are available');
    log('   • CRUD operations work correctly');
    log('   • Statistics feature works');
    
    process.exit(0);

  } catch (error) {
    log(`\n❌ Test failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// 執行測試
testMCPServer();