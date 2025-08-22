#!/usr/bin/env node

/**
 * Claude Code 框架快速設定工具
 * 
 * 使用方式：
 * 1. 在專案目錄執行: node quick-setup.js
 * 2. 或通過 npx: npx claude-framework-setup
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// 顏色輸出
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// 輸出函數
const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
    header: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}\n`)
};

// 創建 readline 介面
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 詢問用戶
const ask = (question, defaultValue = '') => {
    return new Promise((resolve) => {
        const prompt = defaultValue ? `${question} (預設: ${defaultValue}): ` : `${question}: `;
        rl.question(prompt, (answer) => {
            resolve(answer || defaultValue);
        });
    });
};

// 檢測專案類型
const detectProjectType = (projectPath) => {
    const indicators = {
        node: ['package.json'],
        python: ['requirements.txt', 'setup.py', 'pyproject.toml'],
        go: ['go.mod'],
        rust: ['Cargo.toml'],
        java: ['pom.xml', 'build.gradle'],
        dotnet: ['*.csproj', '*.sln'],
        ruby: ['Gemfile'],
        php: ['composer.json']
    };
    
    for (const [type, files] of Object.entries(indicators)) {
        for (const file of files) {
            if (file.includes('*')) {
                const pattern = file.replace('*', '');
                const hasMatch = fs.readdirSync(projectPath).some(f => f.endsWith(pattern));
                if (hasMatch) return type;
            } else if (fs.existsSync(path.join(projectPath, file))) {
                return type;
            }
        }
    }
    
    return 'unknown';
};

// 獲取專案配置
const getProjectConfig = (type) => {
    const configs = {
        node: {
            language: 'JavaScript/TypeScript',
            runtime: 'Node.js',
            packageManager: 'npm',
            testCommand: 'npm test',
            lintCommand: 'npm run lint',
            devCommand: 'npm run dev',
            buildCommand: 'npm run build',
            testFramework: 'Jest/Mocha/Vitest',
            style: 'ES6+, Airbnb Style Guide'
        },
        python: {
            language: 'Python',
            runtime: 'Python 3.x',
            packageManager: 'pip',
            testCommand: 'pytest',
            lintCommand: 'flake8 .',
            devCommand: 'python main.py',
            buildCommand: 'python setup.py build',
            testFramework: 'pytest',
            style: 'PEP 8, Black formatter'
        },
        go: {
            language: 'Go',
            runtime: 'Go 1.19+',
            packageManager: 'go mod',
            testCommand: 'go test ./...',
            lintCommand: 'golangci-lint run',
            devCommand: 'go run .',
            buildCommand: 'go build',
            testFramework: 'Go testing',
            style: 'gofmt, golint'
        },
        rust: {
            language: 'Rust',
            runtime: 'Rust 1.70+',
            packageManager: 'cargo',
            testCommand: 'cargo test',
            lintCommand: 'cargo clippy',
            devCommand: 'cargo run',
            buildCommand: 'cargo build --release',
            testFramework: 'Rust testing',
            style: 'rustfmt'
        },
        default: {
            language: '[請填寫]',
            runtime: '[請填寫]',
            packageManager: '[請填寫]',
            testCommand: '[請填寫測試命令]',
            lintCommand: '[請填寫 lint 命令]',
            devCommand: '[請填寫開發命令]',
            buildCommand: '[請填寫建構命令]',
            testFramework: '[請填寫測試框架]',
            style: '[請填寫程式碼風格]'
        }
    };
    
    return configs[type] || configs.default;
};

// 生成 CLAUDE.md 內容
const generateClaudeMd = (projectName, projectType, config, features = {}) => {
    const template = `# CLAUDE.md - ${projectName}

這個檔案為 Claude Code 提供專案特定的指引和上下文。

## 專案概述

- **專案名稱**: ${projectName}
- **專案類型**: ${projectType}
- **建立日期**: ${new Date().toISOString().split('T')[0]}
- **語言**: ${config.language}
- **執行環境**: ${config.runtime}

## 技術棧

- **語言**: ${config.language}
- **執行環境**: ${config.runtime}
- **套件管理**: ${config.packageManager}
- **測試框架**: ${config.testFramework}
- **程式碼風格**: ${config.style}

## 開發指引

### 程式碼風格
- ${config.style}
- 保持程式碼簡潔易讀
- 適當的註解和文檔

### 錯誤處理
- 使用集中式錯誤處理
- 提供有意義的錯誤訊息
- 適當的日誌記錄

### 測試要求
- 新功能必須包含測試
- 測試覆蓋率目標: 80%+
- TDD/BDD 開發方式

## Claude Code 工作流程

### 1. 實作新功能時
\`\`\`
1. 先使用 TodoWrite 工具規劃任務
2. 查看現有程式碼結構和模式
3. 實作功能
4. 【自動】使用 test-generator sub-agent 生成測試
5. 【自動】使用 code-reviewer sub-agent 審查程式碼
6. 【自動】運行 ${config.testCommand}
7. 【自動】如果有錯誤，立即修復並重新測試
\`\`\`

### 2. 修復錯誤時
\`\`\`
1. 重現錯誤並理解根本原因
2. 編寫失敗的測試案例
3. 修復錯誤使測試通過
4. 【自動】運行 ${config.testCommand} 確保其他測試仍然通過
5. 【自動】使用 code-reviewer sub-agent 審查修復
\`\`\`

### 3. 重構程式碼時
\`\`\`
1. 【自動】運行 ${config.testCommand} 確保有完整的測試覆蓋
2. 小步驟進行重構
3. 【自動】每步後運行測試
4. 保持 API 向後相容
5. 【自動】使用 api-documenter 更新文檔（如果 API 有變更）
\`\`\`

## MCP-Agent 智能協作系統

### 🤖 Agent + MCP 自動化矩陣

| Agent | MCP 整合 | 自動觸發時機 |
|-------|----------|-------------|
| **task-manager-specialist** | \`mcp__task-manager__*\` | 每次開始新工作 |
| **code-reviewer** | \`mcp__task-manager__update_task\` | 完成功能後 |
| **test-generator** | \`mcp__task-manager__create_task\` | 新增功能時 |
| **api-documenter** | \`mcp__task-manager__update_task\` | API 變更後 |
| **api-tester** | \`mcp__task-manager__get_task_stats\` | 測試完成後 |

### 🔄 智能工作流程

#### 新功能開發（全自動）
\`\`\`yaml
觸發: 使用者要求新功能
執行順序:
  1. 創建任務:
     - mcp__task-manager__create_task
  2. 規劃:
     - TodoWrite 建立任務清單
  3. 實作:
     - 編寫程式碼
  4. 測試:
     - test-generator 生成測試
     - 運行 ${config.testCommand}
  5. 審查:
     - code-reviewer 審查程式碼
  6. 完成:
     - mcp__task-manager__update_task(status: completed)
\`\`\`

## MCP 快速指令

### 任務管理
\`\`\`javascript
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
\`\`\`

### Agent 調用
\`\`\`javascript
// 生成測試
Task({
  subagent_type: "test-generator",
  description: "生成測試",
  prompt: "為新功能生成測試"
})

// 審查程式碼
Task({
  subagent_type: "code-reviewer",
  description: "審查",
  prompt: "審查最近的變更"
})
\`\`\`

## 自動化執行規則

### 自動檢查點
1. **每次修改程式碼後自動執行：**
   - ${config.lintCommand}
   - ${config.testCommand}
   - 如果失敗，立即修復

2. **每次完成功能後自動執行：**
   - 運行所有測試
   - 觸發 test-generator 補充測試
   - 觸發 code-reviewer 審查程式碼

3. **每次 API 變更後自動執行：**
   - 觸發 api-documenter 更新文檔
   - 觸發 api-tester 驗證 endpoint

## 常用命令

\`\`\`bash
# 開發
${config.devCommand}

# 測試
${config.testCommand}

# 程式碼品質
${config.lintCommand}

# 建構
${config.buildCommand}
\`\`\`

## 專案特定功能

${features.api ? '### API 開發\n- RESTful API 設計\n- OpenAPI 文檔自動生成\n- API 測試自動化\n' : ''}
${features.database ? '### 資料庫\n- 資料庫遷移管理\n- ORM/ODM 使用\n- 查詢優化\n' : ''}
${features.auth ? '### 認證授權\n- JWT/Session 管理\n- 權限控制\n- 安全最佳實踐\n' : ''}
${features.realtime ? '### 即時功能\n- WebSocket 支援\n- 事件驅動架構\n- 訊息佇列\n' : ''}

## 核心原則

- ✅ 主動執行檢查，不等使用者要求
- ✅ 平行處理提升效率
- ✅ 失敗立即修復，不累積技術債
- ✅ 每個操作都要有對應的測試和文檔
- ✅ 保持程式碼品質和可維護性

---

**記住：始終優先考慮程式碼品質、測試覆蓋和文檔完整性。**
`;
    
    return template;
};

// 生成初始化腳本
const generateInitScript = () => {
    return `// Claude Code 初始化腳本
// 在 Claude Code 中執行此程式碼來初始化專案

async function initProject() {
    console.log("🚀 初始化 Claude Code 框架...");
    
    // 1. 創建初始任務
    const task = await mcp__task-manager__create_task({
        title: "專案初始化",
        description: "設定 Claude Code 自動化框架",
        priority: "high",
        status: "in_progress",
        tags: ["setup", "framework"]
    });
    
    // 2. 設定 TodoWrite
    await TodoWrite([
        { content: "閱讀 CLAUDE.md 了解專案規範", status: "pending" },
        { content: "設定開發環境", status: "pending" },
        { content: "熟悉 MCP 指令", status: "pending" },
        { content: "開始第一個功能開發", status: "pending" }
    ]);
    
    // 3. 完成初始化
    await mcp__task-manager__update_task(task.id, {
        updates: { 
            status: "completed",
            description: "框架初始化完成！"
        }
    });
    
    // 4. 顯示統計
    const stats = await mcp__task-manager__get_task_stats();
    console.log(\`
✅ 初始化完成！
📊 專案狀態:
   - 總任務: \${stats.total}
   - 完成: \${stats.completed}
   - 進行中: \${stats.in_progress}
    \`);
}

// 執行初始化
initProject();
`;
};

// 主函數
async function main() {
    console.clear();
    log.header('🚀 Claude Code 自動化框架 - 快速設定工具');
    
    try {
        // 1. 獲取專案路徑
        const projectPath = process.cwd();
        log.info(`專案路徑: ${projectPath}`);
        
        // 2. 檢測專案類型
        const projectType = detectProjectType(projectPath);
        log.info(`檢測到專案類型: ${projectType}`);
        
        // 3. 詢問專案名稱
        const projectName = await ask('請輸入專案名稱', path.basename(projectPath));
        
        // 4. 詢問是否需要特定功能
        log.header('📦 選擇專案功能');
        const features = {
            api: (await ask('是否包含 API 開發? (y/n)', 'n')).toLowerCase() === 'y',
            database: (await ask('是否使用資料庫? (y/n)', 'n')).toLowerCase() === 'y',
            auth: (await ask('是否需要認證功能? (y/n)', 'n')).toLowerCase() === 'y',
            realtime: (await ask('是否需要即時功能? (y/n)', 'n')).toLowerCase() === 'y'
        };
        
        // 5. 獲取專案配置
        const config = getProjectConfig(projectType);
        
        // 6. 詢問是否自訂命令
        log.header('⚙️ 配置專案命令');
        const customCommands = await ask('是否要自訂命令? (y/n)', 'n');
        if (customCommands.toLowerCase() === 'y') {
            config.testCommand = await ask('測試命令', config.testCommand);
            config.lintCommand = await ask('Lint 命令', config.lintCommand);
            config.devCommand = await ask('開發命令', config.devCommand);
            config.buildCommand = await ask('建構命令', config.buildCommand);
        }
        
        // 7. 生成檔案
        log.header('📝 生成配置檔案');
        
        // 生成 CLAUDE.md
        const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
        fs.writeFileSync(claudeMdPath, generateClaudeMd(projectName, projectType, config, features));
        log.success('CLAUDE.md 已生成');
        
        // 生成初始化腳本
        const initScriptPath = path.join(projectPath, 'claude-init.js');
        fs.writeFileSync(initScriptPath, generateInitScript());
        log.success('claude-init.js 已生成');
        
        // 生成 .claudeignore
        const ignorePath = path.join(projectPath, '.claudeignore');
        if (!fs.existsSync(ignorePath)) {
            const ignoreContent = `# Claude Code 忽略檔案
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
.venv/
venv/
*.tmp
*.temp
`;
            fs.writeFileSync(ignorePath, ignoreContent);
            log.success('.claudeignore 已生成');
        }
        
        // 8. 顯示完成訊息
        log.header('✅ 設定完成！');
        
        console.log(`
${colors.green}已成功創建以下檔案:${colors.reset}
  • CLAUDE.md - 專案配置和自動化規則
  • claude-init.js - 初始化腳本
  • .claudeignore - 忽略檔案配置

${colors.yellow}下一步:${colors.reset}

1. 啟動 Claude Code:
   ${colors.cyan}$ claude${colors.reset}

2. 在 Claude Code 中執行初始化:
   複製以下程式碼並執行:

${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
${generateInitScript()}
${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.green}🎉 Happy Coding with Claude Code!${colors.reset}
        `);
        
    } catch (error) {
        log.error(`設定失敗: ${error.message}`);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// 執行主程式
if (require.main === module) {
    main();
}

module.exports = { detectProjectType, getProjectConfig, generateClaudeMd };