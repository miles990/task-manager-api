#!/usr/bin/env node

/**
 * 完整的 MCP 整合測試
 * 模擬 Claude Code 使用 MCP Task Manager 的實際情境
 */

const taskService = require('./src/services/taskService.js');

async function simulateClaudeCodeWorkflow() {
  console.log('🧠 Claude Code MCP 整合測試');
  console.log('========================================\n');

  try {
    // 情境 1: 用戶要求新功能開發
    console.log('🎯 情境 1: 用戶要求「增加用戶認證功能」');
    console.log('--------------------------------------');
    
    // 1.1 Claude 自動創建追蹤任務
    const authFeatureTask = await taskService.createTask({
      title: '實作用戶認證功能',
      description: '添加登入、註冊、JWT token 驗證功能',
      priority: 'high',
      tags: ['feature', 'auth', 'security'],
      assignee: 'Claude Code'
    });
    console.log('✅ 自動創建主任務:', authFeatureTask.title);

    // 1.2 分解為子任務
    const subTasks = await Promise.all([
      taskService.createTask({
        title: '設計認證資料模型',
        description: 'User, Role, Permission 模型設計',
        priority: 'high',
        tags: ['auth', 'database', 'design']
      }),
      taskService.createTask({
        title: '實作註冊 API',
        description: '用戶註冊端點和驗證邏輯',
        priority: 'medium',
        tags: ['auth', 'api', 'validation']
      }),
      taskService.createTask({
        title: '實作登入 API',
        description: 'JWT token 生成和驗證',
        priority: 'high',
        tags: ['auth', 'api', 'jwt']
      }),
      taskService.createTask({
        title: '添加中介軟體',
        description: '認證中介軟體保護路由',
        priority: 'medium',
        tags: ['auth', 'middleware']
      })
    ]);
    console.log(`✅ 自動分解為 ${subTasks.length} 個子任務`);

    // 1.3 開始工作 (更新任務狀態)
    const inProgressTask = await taskService.updateTask(subTasks[0].id, {
      status: 'in_progress'
    });
    console.log('🔄 開始處理:', inProgressTask.title);

    // 情境 2: 遇到 Bug 需要修復
    console.log('\n🐛 情境 2: 發現資料庫連接錯誤');
    console.log('--------------------------------------');
    
    const bugTask = await taskService.createTask({
      title: '修復: 資料庫連接超時',
      description: '在高並發情況下資料庫連接池耗盡',
      priority: 'urgent',
      tags: ['bug', 'database', 'performance'],
      assignee: 'Claude Code'
    });
    console.log('🚨 自動創建緊急任務:', bugTask.title);

    // 2.1 立即開始修復
    await taskService.updateTask(bugTask.id, {
      status: 'in_progress'
    });
    console.log('🔧 立即開始修復');

    // 2.2 修復完成
    await taskService.updateTask(bugTask.id, {
      status: 'completed',
      description: bugTask.description + '\n\n修復方案: 增加連接池大小並添加重試機制'
    });
    console.log('✅ Bug 修復完成');

    // 情境 3: 完成功能開發
    console.log('\n🎉 情境 3: 完成認證功能開發');
    console.log('--------------------------------------');

    // 3.1 標記子任務完成
    for (const subTask of subTasks) {
      await taskService.updateTask(subTask.id, {
        status: 'completed'
      });
    }
    console.log('✅ 所有子任務已完成');

    // 3.2 標記主任務完成
    await taskService.updateTask(authFeatureTask.id, {
      status: 'completed',
      description: authFeatureTask.description + '\n\n完成項目:\n- 資料模型設計\n- 註冊/登入 API\n- JWT 驗證\n- 路由保護'
    });
    console.log('✅ 主任務已完成');

    // 情境 4: 生成進度報告
    console.log('\n📊 情境 4: 生成項目進度報告');
    console.log('--------------------------------------');

    const stats = await taskService.getStatistics();
    console.log('📈 任務統計:');
    console.log(`   總任務: ${stats.total}`);
    console.log(`   已完成: ${stats.byStatus.completed} (${stats.total > 0 ? ((stats.byStatus.completed / stats.total) * 100).toFixed(1) : 0}%)`);
    console.log(`   進行中: ${stats.byStatus.in_progress}`);
    console.log(`   待處理: ${stats.byStatus.pending}`);
    console.log(`   高優先級: ${stats.byPriority.high + stats.byPriority.urgent}`);

    // 情境 5: 列出所有相關任務
    console.log('\n📝 情境 5: 查看所有認證相關任務');
    console.log('--------------------------------------');

    const authTasks = await taskService.getAllTasks({});
    const authRelatedTasks = authTasks.filter(task => 
      task.tags && (task.tags.includes('auth') || task.tags.includes('security'))
    );

    console.log(`🔍 找到 ${authRelatedTasks.length} 個認證相關任務:`);
    authRelatedTasks.forEach((task, index) => {
      console.log(`   ${index + 1}. [${task.status}] ${task.title} (${task.priority})`);
      if (task.tags) {
        console.log(`      標籤: ${task.tags.join(', ')}`);
      }
    });

    // 情境 6: 清理測試數據 (可選)
    console.log('\n🧹 情境 6: 清理測試數據');
    console.log('--------------------------------------');
    
    const testTasks = [authFeatureTask, bugTask, ...subTasks];
    let cleanedCount = 0;
    
    for (const task of testTasks) {
      try {
        await taskService.deleteTask(task.id);
        cleanedCount++;
      } catch (error) {
        // 任務可能已被刪除，忽略錯誤
      }
    }
    console.log(`🗑️  清理了 ${cleanedCount} 個測試任務`);

    // 最終報告
    console.log('\n🎯 測試總結');
    console.log('========================================');
    console.log('✅ MCP Task Manager 整合測試成功！');
    console.log('✅ 所有工作流程運行正常');
    console.log('✅ Claude Code 可以有效使用 MCP 進行任務管理');

    return {
      success: true,
      scenarios: {
        'feature_development': '✅',
        'bug_fixing': '✅',
        'task_completion': '✅',
        'progress_reporting': '✅',
        'task_filtering': '✅',
        'cleanup': '✅'
      },
      stats: stats
    };

  } catch (error) {
    console.error('❌ 整合測試失敗:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// 執行整合測試
if (require.main === module) {
  simulateClaudeCodeWorkflow()
    .then(result => {
      if (result.success) {
        console.log('\n🏆 整合測試結果: 成功');
        console.log('\n📊 測試場景結果:');
        Object.entries(result.scenarios).forEach(([scenario, status]) => {
          console.log(`   ${scenario.replace(/_/g, ' ').toUpperCase()}: ${status}`);
        });
        process.exit(0);
      } else {
        console.log('\n💥 整合測試結果: 失敗');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 未預期的錯誤:', error);
      process.exit(1);
    });
}

module.exports = { simulateClaudeCodeWorkflow };