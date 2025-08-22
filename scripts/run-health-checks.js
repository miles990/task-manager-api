#!/usr/bin/env node

/**
 * Automated Health Check Script
 * 執行所有功能的健康檢查並生成報告
 */

import { featureTracker, initializeTracking } from '../src/monitoring/feature-tracker.js';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 初始化追蹤系統
initializeTracking();

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 檢查 Sub-Agent 配置
 */
async function checkSubAgents() {
  log('\n🤖 Checking Sub-Agents...', 'cyan');
  
  const subAgents = [
    'api-tester',
    'code-reviewer', 
    'test-generator',
    'api-documenter',
    'security-auditor',
    'monitoring-agent'
  ];

  const results = [];

  for (const agent of subAgents) {
    const result = {
      name: agent,
      checks: {}
    };

    // 檢查配置文件
    const configPath = path.join('.claude', 'sub-agents', `${agent}.md`);
    try {
      await fs.access(configPath);
      result.checks.configExists = { passed: true, message: '✓ Config file exists' };
      
      // 讀取並驗證配置
      const content = await fs.readFile(configPath, 'utf8');
      result.checks.validFormat = {
        passed: content.includes('## ') && content.length > 100,
        message: content.length > 100 ? '✓ Valid configuration' : '✗ Configuration too short'
      };
    } catch (error) {
      result.checks.configExists = { passed: false, message: '✗ Config file not found' };
    }

    // 更新追蹤系統
    const featureId = `sa-${agent}`;
    if (result.checks.configExists?.passed) {
      featureTracker.updateFeatureStatus(featureId, 'active');
    } else {
      featureTracker.updateFeatureStatus(featureId, 'inactive');
    }

    results.push(result);
  }

  // 顯示結果
  for (const result of results) {
    const allPassed = Object.values(result.checks).every(c => c.passed);
    const statusIcon = allPassed ? '✅' : '❌';
    const statusColor = allPassed ? 'green' : 'red';
    
    log(`  ${statusIcon} ${result.name}`, statusColor);
    for (const [checkName, check] of Object.entries(result.checks)) {
      const checkColor = check.passed ? 'green' : 'yellow';
      log(`     ${check.message}`, checkColor);
    }
  }

  return results;
}

/**
 * 檢查 MCP 整合
 */
async function checkMCPIntegrations() {
  log('\n🔌 Checking MCP Integrations...', 'cyan');

  const mcpConfigs = {
    'sqlite': {
      command: 'npx @modelcontextprotocol/server-sqlite --version',
      envRequired: false
    },
    'github': {
      command: 'echo $GITHUB_TOKEN | wc -c',
      envRequired: true,
      minLength: 10
    },
    'slack': {
      command: 'echo $SLACK_TOKEN | wc -c',
      envRequired: true,
      minLength: 10
    }
  };

  const results = [];

  for (const [name, config] of Object.entries(mcpConfigs)) {
    const result = {
      name,
      checks: {}
    };

    // 檢查環境變數
    if (config.envRequired) {
      const envVar = `${name.toUpperCase()}_TOKEN`;
      const hasEnv = process.env[envVar] && process.env[envVar].length > (config.minLength || 0);
      result.checks.authentication = {
        passed: hasEnv,
        message: hasEnv ? '✓ Authentication configured' : '✗ Missing authentication'
      };
    }

    // 檢查命令可用性
    try {
      const { stdout, stderr } = await execAsync(config.command);
      result.checks.available = {
        passed: !stderr || stderr.length === 0,
        message: '✓ Service available'
      };
    } catch (error) {
      result.checks.available = {
        passed: false,
        message: '✗ Service not available'
      };
    }

    // 更新追蹤系統
    const featureId = `mcp-${name}`;
    const allPassed = Object.values(result.checks).every(c => c.passed);
    featureTracker.updateFeatureStatus(
      featureId,
      allPassed ? 'active' : 'degraded'
    );

    results.push(result);
  }

  // 顯示結果
  for (const result of results) {
    const allPassed = Object.values(result.checks).every(c => c.passed);
    const statusIcon = allPassed ? '✅' : '⚠️';
    const statusColor = allPassed ? 'green' : 'yellow';
    
    log(`  ${statusIcon} ${result.name}`, statusColor);
    for (const [checkName, check] of Object.entries(result.checks)) {
      const checkColor = check.passed ? 'green' : 'yellow';
      log(`     ${check.message}`, checkColor);
    }
  }

  return results;
}

/**
 * 檢查 Hooks
 */
async function checkHooks() {
  log('\n🎯 Checking Hooks...', 'cyan');

  const hooks = [
    'post-tool-use',
    'pre-commit',
    'pre-tool-use',
    'session-start',
    'session-end'
  ];

  const results = [];

  for (const hook of hooks) {
    const result = {
      name: hook,
      checks: {}
    };

    const scriptPath = path.join('hooks', `${hook}.sh`);

    try {
      const stats = await fs.stat(scriptPath);
      
      result.checks.exists = {
        passed: true,
        message: '✓ Script file exists'
      };

      // 檢查執行權限 (Unix)
      const isExecutable = (stats.mode & parseInt('111', 8)) !== 0;
      result.checks.executable = {
        passed: isExecutable,
        message: isExecutable ? '✓ Has execute permission' : '✗ Missing execute permission'
      };

      // 檢查腳本語法
      try {
        await execAsync(`bash -n ${scriptPath}`);
        result.checks.syntax = {
          passed: true,
          message: '✓ Valid bash syntax'
        };
      } catch {
        result.checks.syntax = {
          passed: false,
          message: '✗ Syntax errors detected'
        };
      }

    } catch (error) {
      result.checks.exists = {
        passed: false,
        message: '✗ Script file not found'
      };
    }

    // 更新追蹤系統
    const featureId = `hook-${hook}`;
    const allPassed = Object.values(result.checks).every(c => c.passed);
    featureTracker.updateFeatureStatus(
      featureId,
      allPassed ? 'active' : result.checks.exists?.passed ? 'degraded' : 'inactive'
    );

    results.push(result);
  }

  // 顯示結果
  for (const result of results) {
    const allPassed = Object.values(result.checks).every(c => c.passed);
    const statusIcon = allPassed ? '✅' : result.checks.exists?.passed ? '⚠️' : '❌';
    const statusColor = allPassed ? 'green' : result.checks.exists?.passed ? 'yellow' : 'red';
    
    log(`  ${statusIcon} ${result.name}`, statusColor);
    for (const [checkName, check] of Object.entries(result.checks)) {
      const checkColor = check.passed ? 'green' : 'yellow';
      log(`     ${check.message}`, checkColor);
    }
  }

  return results;
}

/**
 * 檢查系統整體健康
 */
async function checkSystemHealth() {
  log('\n💊 System Health Overview...', 'cyan');

  const checks = {
    nodeVersion: {
      name: 'Node.js Version',
      command: 'node --version',
      validator: (output) => output.includes('v18') || output.includes('v20')
    },
    npmVersion: {
      name: 'NPM Version',
      command: 'npm --version',
      validator: (output) => parseInt(output) >= 8
    },
    dependencies: {
      name: 'Dependencies',
      command: 'npm ls --depth=0',
      validator: (output) => !output.includes('UNMET')
    },
    gitStatus: {
      name: 'Git Repository',
      command: 'git status --porcelain',
      validator: (output) => true // Just check if git works
    }
  };

  const results = [];

  for (const [key, check] of Object.entries(checks)) {
    try {
      const { stdout } = await execAsync(check.command);
      const passed = check.validator(stdout);
      
      results.push({
        name: check.name,
        passed,
        message: passed ? `✓ ${check.name} OK` : `✗ ${check.name} issue detected`
      });
    } catch (error) {
      results.push({
        name: check.name,
        passed: false,
        message: `✗ ${check.name} check failed`
      });
    }
  }

  // 顯示結果
  for (const result of results) {
    const color = result.passed ? 'green' : 'red';
    log(`  ${result.message}`, color);
  }

  return results;
}

/**
 * 生成健康報告
 */
async function generateHealthReport(results) {
  log('\n📊 Generating Health Report...', 'cyan');

  const dashboard = featureTracker.getDashboard();
  const report = featureTracker.generateReport('24h');

  const reportContent = `# Health Check Report
Generated: ${new Date().toISOString()}

## Summary
- Total Features: ${dashboard.summary.total}
- Active: ${dashboard.summary.active}
- Inactive: ${dashboard.summary.inactive}
- Degraded: ${dashboard.summary.degraded}
- Errors: ${dashboard.summary.error}

## Sub-Agents Status
${dashboard.features['sub-agents'].map(f => 
  `- ${f.name}: ${f.status} (Health: ${f.health.status})`
).join('\n')}

## MCP Integrations Status
${dashboard.features['mcp'].map(f => 
  `- ${f.name}: ${f.status} (Health: ${f.health.status})`
).join('\n')}

## Hooks Status
${dashboard.features['hooks'].map(f => 
  `- ${f.name}: ${f.status} (Health: ${f.health.status})`
).join('\n')}

## Alerts
${dashboard.alerts.length > 0 
  ? dashboard.alerts.map(a => `- [${a.level}] ${a.message}`).join('\n')
  : 'No alerts at this time.'}

## Recommendations
${report.summary.needsAttention.length > 0
  ? report.summary.needsAttention.map(f => `- Fix ${f.name}: ${f.issue}`).join('\n')
  : '- All systems operating normally'}

---
*Report generated by automated health check system*
`;

  // 保存報告
  const reportPath = path.join('logs', `health-report-${Date.now()}.md`);
  await fs.mkdir('logs', { recursive: true });
  await fs.writeFile(reportPath, reportContent);

  log(`\n✅ Report saved to ${reportPath}`, 'green');
  
  // 顯示摘要
  log('\n📈 Health Summary:', 'bright');
  log(`  Total Features: ${dashboard.summary.total}`);
  log(`  Healthy: ${dashboard.summary.active}`, 'green');
  log(`  Degraded: ${dashboard.summary.degraded}`, 'yellow');
  log(`  Failed: ${dashboard.summary.inactive + dashboard.summary.error}`, 'red');
  
  if (dashboard.alerts.length > 0) {
    log('\n⚠️  Active Alerts:', 'yellow');
    dashboard.alerts.forEach(alert => {
      const color = alert.level === 'critical' ? 'red' : 'yellow';
      log(`  - [${alert.level}] ${alert.message}`, color);
    });
  }

  return reportContent;
}

/**
 * 主執行函數
 */
async function main() {
  log('🏥 Starting Health Check System', 'bright');
  log('=' .repeat(50));

  try {
    // 執行所有檢查
    const subAgentResults = await checkSubAgents();
    const mcpResults = await checkMCPIntegrations();
    const hookResults = await checkHooks();
    const systemResults = await checkSystemHealth();

    // 執行批次健康檢查
    log('\n🔍 Running comprehensive health checks...', 'cyan');
    const healthCheckResults = await featureTracker.runHealthChecks();

    // 生成報告
    const report = await generateHealthReport({
      subAgents: subAgentResults,
      mcp: mcpResults,
      hooks: hookResults,
      system: systemResults,
      healthChecks: healthCheckResults
    });

    log('\n' + '=' .repeat(50));
    log('✅ Health check completed successfully!', 'green');

    // 如果有嚴重問題，返回非零退出碼
    const dashboard = featureTracker.getDashboard();
    if (dashboard.summary.error > 0) {
      process.exit(1);
    }

  } catch (error) {
    log(`\n❌ Health check failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// 執行健康檢查
main();