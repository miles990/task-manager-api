#!/usr/bin/env node

/**
 * Simple MCP Server test - tests tools directly without subprocess
 */

const { z } = require('zod');
const taskService = require('./src/services/taskService.js');

// Test schemas
const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'archived']).default('pending').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
});

async function testMCPTools() {
  console.log('🚀 開始測試 MCP 工具功能...\n');

  try {
    // 1. 測試 create_task
    console.log('1️⃣ 測試 create_task 工具...');
    const createArgs = {
      title: 'MCP 測試任務',
      description: '通過 MCP 工具創建的測試任務',
      priority: 'high',
      tags: ['mcp', 'test']
    };

    const validated = CreateTaskSchema.parse(createArgs);
    const task = await taskService.createTask(validated);
    console.log('✅ create_task 成功:', {
      id: task.id,
      title: task.title,
      priority: task.priority,
      status: task.status
    });

    // 2. 測試 list_tasks
    console.log('\n2️⃣ 測試 list_tasks 工具...');
    const tasks = await taskService.getAllTasks({});
    console.log(`✅ list_tasks 成功: 找到 ${tasks.length} 個任務`);
    tasks.forEach((t, i) => {
      console.log(`   ${i + 1}. [${t.status}] ${t.title} (${t.priority})`);
    });

    // 3. 測試 get_task
    console.log('\n3️⃣ 測試 get_task 工具...');
    const specificTask = await taskService.getTask(task.id);
    console.log('✅ get_task 成功:', {
      id: specificTask.id,
      title: specificTask.title,
      status: specificTask.status,
      tags: specificTask.tags
    });

    // 4. 測試 update_task
    console.log('\n4️⃣ 測試 update_task 工具...');
    const updatedTask = await taskService.updateTask(task.id, {
      status: 'completed',
      priority: 'urgent'
    });
    console.log('✅ update_task 成功:', {
      id: updatedTask.id,
      status: updatedTask.status,
      priority: updatedTask.priority
    });

    // 5. 測試 get_task_stats
    console.log('\n5️⃣ 測試 get_task_stats 工具...');
    const stats = await taskService.getStatistics();
    console.log('✅ get_task_stats 成功:');
    console.log(`   總任務數: ${stats.total}`);
    console.log(`   已完成: ${stats.byStatus.completed}`);
    console.log(`   進行中: ${stats.byStatus.in_progress}`);
    console.log(`   待處理: ${stats.byStatus.pending}`);
    console.log(`   已歸檔: ${stats.byStatus.archived}`);
    console.log(`   逾期任務: ${stats.overdue}`);

    // 6. 測試 delete_task
    console.log('\n6️⃣ 測試 delete_task 工具...');
    const deleteResult = await taskService.deleteTask(task.id);
    console.log('✅ delete_task 成功:', deleteResult.message);

    console.log('\n🎉 所有 MCP 工具測試通過！');
    
    return {
      success: true,
      testResults: {
        create_task: '✅',
        list_tasks: '✅',
        get_task: '✅', 
        update_task: '✅',
        get_task_stats: '✅',
        delete_task: '✅'
      }
    };

  } catch (error) {
    console.error('❌ MCP 工具測試失敗:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// 執行測試
if (require.main === module) {
  testMCPTools()
    .then(result => {
      if (result.success) {
        console.log('\n📊 測試摘要:');
        Object.entries(result.testResults).forEach(([tool, status]) => {
          console.log(`   ${tool}: ${status}`);
        });
        console.log('\n✅ 所有 MCP 工具功能正常！');
        process.exit(0);
      } else {
        console.log('\n❌ MCP 工具測試失敗');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 未預期的錯誤:', error);
      process.exit(1);
    });
}

module.exports = { testMCPTools };