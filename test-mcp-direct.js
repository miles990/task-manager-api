#!/usr/bin/env node

/**
 * Direct test for MCP Task Manager functionality
 * Tests the basic task operations without MCP protocol
 */

const TaskService = require('./src/services/taskService.js');

async function testTaskManager() {
  console.log('🚀 開始測試 Task Manager 直接功能...\n');

  try {
    // 測試 1: 創建任務
    console.log('1️⃣ 測試創建任務...');
    const newTask = await TaskService.createTask({
      title: 'MCP 整合測試任務',
      description: '測試 MCP Task Manager 的完整功能，包括創建、列出和統計功能',
      priority: 'medium',
      tags: ['test', 'mcp', 'integration']
    });
    console.log('✅ 任務已創建:', {
      id: newTask.id,
      title: newTask.title,
      status: newTask.status,
      priority: newTask.priority
    });

    // 測試 2: 列出所有任務
    console.log('\n2️⃣ 測試列出任務...');
    const allTasks = await TaskService.getAllTasks({});
    console.log(`✅ 找到 ${allTasks.length} 個任務:`);
    allTasks.forEach((task, index) => {
      console.log(`   ${index + 1}. [${task.status}] ${task.title} (${task.priority})`);
    });

    // 測試 3: 獲取統計資料
    console.log('\n3️⃣ 測試獲取統計資料...');
    const stats = await TaskService.getStatistics();
    console.log('✅ 任務統計資料:', stats);

    // 測試 4: 更新任務
    console.log('\n4️⃣ 測試更新任務...');
    const updatedTask = await TaskService.updateTask(newTask.id, {
      status: 'completed',
      priority: 'high'
    });
    console.log('✅ 任務已更新:', {
      id: updatedTask.id,
      status: updatedTask.status,
      priority: updatedTask.priority
    });

    // 測試 5: 獲取特定任務
    console.log('\n5️⃣ 測試獲取特定任務...');
    const specificTask = await TaskService.getTask(newTask.id);
    console.log('✅ 任務詳情:', {
      id: specificTask.id,
      title: specificTask.title,
      status: specificTask.status,
      priority: specificTask.priority,
      tags: specificTask.tags
    });

    // 測試 6: 最終統計
    console.log('\n6️⃣ 最終統計資料...');
    const finalStats = await TaskService.getStatistics();
    console.log('✅ 最終統計:', finalStats);

    console.log('\n🎉 所有測試通過！MCP Task Manager 功能正常運作。');
    
    return {
      success: true,
      taskId: newTask.id,
      totalTasks: allTasks.length,
      stats: finalStats
    };

  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.error(error.stack);
    return {
      success: false,
      error: error.message
    };
  }
}

// 執行測試
if (require.main === module) {
  testTaskManager()
    .then(result => {
      if (result.success) {
        console.log('\n✅ 測試結果: 成功');
        console.log(`📝 任務 ID: ${result.taskId}`);
        console.log(`📊 總任務數: ${result.totalTasks}`);
        process.exit(0);
      } else {
        console.log('\n❌ 測試結果: 失敗');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 未預期的錯誤:', error);
      process.exit(1);
    });
}

module.exports = { testTaskManager };