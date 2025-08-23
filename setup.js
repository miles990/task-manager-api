#!/usr/bin/env node

/**
 * Universal Project Manager - Setup Script
 * 通用專案管理器初始化腳本
 * 
 * 使用方法：
 * node setup.js [項目類型] [項目名稱] [項目路徑]
 * 
 * 範例：
 * node setup.js node-api my-api-project /path/to/project
 * node setup.js react-app my-react-app /path/to/project
 * node setup.js existing existing-project /existing/project/path
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class UniversalSetup {
  constructor() {
    this.frameworkPath = process.cwd();
    this.configPath = path.join(this.frameworkPath, 'config', 'projects.json');
    
    // 先綁定所有方法到 this
    this.generateNodePackageJson = this.generateNodePackageJson.bind(this);
    this.generateNodeIndex = this.generateNodeIndex.bind(this);
    this.generateNodeConfig = this.generateNodeConfig.bind(this);
    this.generateNodeMCPServer = this.generateNodeMCPServer.bind(this);
    this.generateReactPackageJson = this.generateReactPackageJson.bind(this);
    this.generateReactIndex = this.generateReactIndex.bind(this);
    this.generateReactApp = this.generateReactApp.bind(this);
    this.generateReactHTML = this.generateReactHTML.bind(this);
    this.generatePythonRequirements = this.generatePythonRequirements.bind(this);
    this.generatePythonMain = this.generatePythonMain.bind(this);
    this.generatePythonMCPServer = this.generatePythonMCPServer.bind(this);
    this.generatePythonGitignore = this.generatePythonGitignore.bind(this);
    this.generateGoMod = this.generateGoMod.bind(this);
    this.generateGoMain = this.generateGoMain.bind(this);
    this.generateGoConfig = this.generateGoConfig.bind(this);
    this.generateGoMCPServer = this.generateGoMCPServer.bind(this);
    this.generateGoGitignore = this.generateGoGitignore.bind(this);
    this.generateEnvExample = this.generateEnvExample.bind(this);
    this.generateGitignore = this.generateGitignore.bind(this);
    this.generateReadme = this.generateReadme.bind(this);
    
    // 然後定義 templates
    this.templates = {
      'node-api': {
        description: 'Node.js API 專案',
        files: {
          'package.json': this.generateNodePackageJson,
          'src/index.js': this.generateNodeIndex,
          'src/config/index.js': this.generateNodeConfig,
          'src/mcp-server.js': this.generateNodeMCPServer,
          '.env.example': this.generateEnvExample,
          '.gitignore': this.generateGitignore,
          'README.md': this.generateReadme
        },
        directories: ['src', 'src/config', 'src/routes', 'src/services', 'tests', 'scripts']
      },
      'react-app': {
        description: 'React 前端專案',
        files: {
          'package.json': this.generateReactPackageJson,
          'src/index.js': this.generateReactIndex,
          'src/App.js': this.generateReactApp,
          'public/index.html': this.generateReactHTML,
          '.gitignore': this.generateGitignore,
          'README.md': this.generateReadme
        },
        directories: ['src', 'src/components', 'src/hooks', 'public', 'tests']
      },
      'python-api': {
        description: 'Python API 專案',
        files: {
          'requirements.txt': this.generatePythonRequirements,
          'app/__init__.py': () => '# Python API Application\n',
          'app/main.py': this.generatePythonMain,
          'mcp_server.py': this.generatePythonMCPServer,
          '.env.example': this.generateEnvExample,
          '.gitignore': this.generatePythonGitignore,
          'README.md': this.generateReadme
        },
        directories: ['app', 'tests']
      },
      'go-api': {
        description: 'Go API 專案',
        files: {
          'go.mod': this.generateGoMod,
          'cmd/main.go': this.generateGoMain,
          'internal/config/config.go': this.generateGoConfig,
          'cmd/mcp-server/main.go': this.generateGoMCPServer,
          '.env.example': this.generateEnvExample,
          '.gitignore': this.generateGoGitignore,
          'README.md': this.generateReadme
        },
        directories: ['cmd', 'internal', 'internal/config', 'pkg', 'tests']
      }
    };
  }

  /**
   * 主要設置流程
   */
  async setup(args = []) {
    console.log('🏗️  Universal Project Manager - 專案初始化');
    console.log('═══════════════════════════════════════════');

    const [projectType, projectName, projectPath] = args;

    if (!projectType) {
      return this.showHelp();
    }

    if (projectType === 'framework') {
      return this.setupFramework();
    }

    if (projectType === 'existing') {
      return this.addExistingProject(projectName, projectPath);
    }

    if (!this.templates[projectType]) {
      console.error(`❌ 不支援的專案類型: ${projectType}`);
      return this.showHelp();
    }

    return this.createNewProject(projectType, projectName, projectPath);
  }

  /**
   * 顯示幫助資訊
   */
  showHelp() {
    console.log(`
📖 使用方法:

  node setup.js framework                     # 初始化框架本身
  node setup.js [type] [name] [path]         # 創建新專案
  node setup.js existing [name] [path]       # 添加現有專案

📋 支援的專案類型:
  • node-api      - Node.js API 專案
  • react-app     - React 前端專案  
  • python-api    - Python API 專案
  • go-api        - Go API 專案
  • existing      - 添加現有專案

🔧 範例:
  node setup.js node-api my-task-api ./my-project
  node setup.js react-app my-frontend ./frontend
  node setup.js existing legacy-app ./legacy
  node setup.js framework

💡 提示: 如果不提供路徑，將在當前目錄創建專案
    `);
  }

  /**
   * 初始化框架本身
   */
  async setupFramework() {
    console.log('🏗️  初始化通用專案管理框架...');

    // 創建配置目錄
    const configDir = path.join(this.frameworkPath, 'config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
      console.log('✅ 創建配置目錄');
    }

    // 創建預設配置文件（如果不存在）
    if (!fs.existsSync(this.configPath)) {
      const defaultConfig = {
        framework: {
          name: "Universal Project Manager",
          version: "2.0.0",
          description: "通用專案管理框架 - 基於 Claude Code 最佳實踐",
          type: "universal-framework"
        },
        defaultProject: null,
        projects: {},
        templates: {
          "node-api": {
            description: "Node.js API 專案模板",
            features: { mcp: { enabled: true } }
          },
          "react-app": {
            description: "React 前端專案模板",
            features: { mcp: { enabled: false } }
          },
          "python-api": {
            description: "Python API 專案模板", 
            features: { mcp: { enabled: true } }
          },
          "go-api": {
            description: "Go API 專案模板",
            features: { mcp: { enabled: true } }
          }
        },
        globalSettings: {
          autoSetup: true,
          enableMCP: true,
          defaultDatabase: "sqlite"
        }
      };

      fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig, null, 2));
      console.log('✅ 創建預設配置文件');
    }

    // 更新 package.json 腳本
    this.updatePackageJsonScripts();

    console.log('🎉 框架初始化完成！');
    console.log('\n📖 下一步:');
    console.log('1. node setup.js node-api my-first-project  # 創建第一個專案');
    console.log('2. npm run start:framework                   # 啟動框架');
    console.log('3. 查看 QUICK_START.md 了解更多');
  }

  /**
   * 創建新專案
   */
  async createNewProject(projectType, projectName, projectPath) {
    if (!projectName) {
      console.error('❌ 請提供專案名稱');
      return;
    }

    const targetPath = projectPath ? path.resolve(projectPath) : path.join(process.cwd(), projectName);
    const template = this.templates[projectType];

    console.log(`🏗️  創建 ${template.description}: ${projectName}`);
    console.log(`📁 目標路徑: ${targetPath}`);

    // 創建專案目錄
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // 創建子目錄
    for (const dir of template.directories) {
      const dirPath = path.join(targetPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // 創建文件
    for (const [filePath, generator] of Object.entries(template.files)) {
      const fullPath = path.join(targetPath, filePath);
      const content = typeof generator === 'function' ? generator(projectName, projectType) : generator;
      
      // 確保目錄存在
      const fileDir = path.dirname(fullPath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`✅ 創建文件: ${filePath}`);
    }

    // 添加到框架配置
    this.addProjectToConfig(projectName, projectType, targetPath);

    // 初始化 git 倉庫（如果需要）
    try {
      process.chdir(targetPath);
      if (!fs.existsSync('.git')) {
        execSync('git init', { stdio: 'inherit' });
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "Initial commit: Created with Universal Project Manager"', { stdio: 'inherit' });
        console.log('✅ 初始化 Git 倉庫');
      }
    } catch (error) {
      console.log('⚠️  Git 初始化失敗（可能未安裝 git）');
    }

    // 安裝依賴（Node.js 專案）
    if (projectType === 'node-api') {
      try {
        console.log('📦 安裝 Node.js 依賴...');
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ 依賴安裝完成');
      } catch (error) {
        console.log('⚠️  依賴安裝失敗，請手動運行 npm install');
      }
    }

    console.log(`\n🎉 專案創建完成！`);
    console.log(`\n🚀 下一步:`);
    console.log(`cd ${targetPath}`);
    
    if (projectType === 'node-api') {
      console.log('npm start                    # 啟動 API 伺服器');
      console.log('npm run start:mcp           # 啟動 MCP 伺服器');
    }
    
    console.log('\n💡 使用框架管理專案:');
    console.log('node setup.js framework     # 查看框架狀態');
  }

  /**
   * 添加現有專案
   */
  async addExistingProject(projectName, projectPath) {
    if (!projectName || !projectPath) {
      console.error('❌ 請提供專案名稱和路徑');
      return;
    }

    const fullPath = path.resolve(projectPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ 專案路徑不存在: ${fullPath}`);
      return;
    }

    // 偵測專案類型
    const detectedType = this.detectProjectType(fullPath);
    
    console.log(`🔍 添加現有專案: ${projectName}`);
    console.log(`📁 路徑: ${fullPath}`);
    console.log(`🎯 偵測類型: ${detectedType}`);

    // 添加到框架配置
    this.addProjectToConfig(projectName, detectedType, fullPath);

    console.log(`✅ 專案 "${projectName}" 已添加到框架！`);
    console.log('\n💡 使用 mcp__universal-project-manager__switch_project 切換到此專案');
  }

  /**
   * 偵測專案類型
   */
  detectProjectType(projectPath) {
    if (fs.existsSync(path.join(projectPath, 'package.json'))) {
      const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8'));
      
      if (packageJson.dependencies?.react) {
        return 'react-app';
      }
      if (packageJson.dependencies?.express) {
        return 'node-api';
      }
      return 'node-api'; // 預設為 Node.js
    }
    
    if (fs.existsSync(path.join(projectPath, 'requirements.txt'))) {
      return 'python-api';
    }
    
    if (fs.existsSync(path.join(projectPath, 'go.mod'))) {
      return 'go-api';
    }
    
    return 'generic';
  }

  /**
   * 添加專案到配置
   */
  addProjectToConfig(projectName, projectType, projectPath) {
    let config = {};
    
    if (fs.existsSync(this.configPath)) {
      config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    } else {
      // 如果配置文件不存在，先初始化框架
      this.setupFramework();
      config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    }

    // 獲取專案描述，處理可能的 undefined
    let projectDescription = projectType;
    if (this.templates && this.templates[projectType]) {
      projectDescription = this.templates[projectType].description || projectType;
    }

    const projectConfig = {
      name: projectName,
      type: projectType,
      description: `${projectDescription} 專案`,
      rootPath: projectPath,
      config: this.getProjectDefaultConfig(projectType),
      features: this.getProjectDefaultFeatures(projectType),
      scripts: this.getProjectDefaultScripts(projectType),
      createdAt: new Date().toISOString(),
      active: true
    };

    config.projects[projectName] = projectConfig;
    
    // 如果是第一個專案，設為預設
    if (!config.defaultProject) {
      config.defaultProject = projectName;
    }

    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    console.log(`✅ 專案配置已保存`);
  }

  /**
   * 獲取專案預設配置
   */
  getProjectDefaultConfig(projectType) {
    const defaults = {
      'node-api': {
        api: { port: 3000, basePath: '/api', version: '1.0.0' },
        database: { type: 'sqlite', path: './data/tasks.db' },
        mcp: { enabled: true, serverName: 'project-manager', tools: ['get_status', 'create_task'] }
      },
      'react-app': {
        api: { port: 3001 },
        mcp: { enabled: false }
      },
      'python-api': {
        api: { port: 8000, basePath: '/api' },
        mcp: { enabled: true, serverName: 'python-manager' }
      },
      'go-api': {
        api: { port: 8080, basePath: '/api' },
        mcp: { enabled: true, serverName: 'go-manager' }
      }
    };
    
    return defaults[projectType] || {};
  }

  /**
   * 獲取專案預設功能
   */
  getProjectDefaultFeatures(projectType) {
    const defaults = {
      'node-api': { taskManagement: true, apiServer: true, database: true, mcp: true, testing: true },
      'react-app': { frontend: true, testing: true },
      'python-api': { apiServer: true, mcp: true, testing: true },
      'go-api': { apiServer: true, mcp: true, testing: true }
    };
    
    return defaults[projectType] || {};
  }

  /**
   * 獲取專案預設腳本
   */
  getProjectDefaultScripts(projectType) {
    const defaults = {
      'node-api': {
        'start': 'node src/index.js',
        'start:mcp': 'node src/mcp-server.js',
        'dev': 'node --watch src/index.js',
        'test': 'node --test tests/'
      },
      'react-app': {
        'start': 'react-scripts start',
        'build': 'react-scripts build',
        'test': 'react-scripts test'
      },
      'python-api': {
        'start': 'python app/main.py',
        'start:mcp': 'python mcp_server.py',
        'test': 'python -m pytest'
      },
      'go-api': {
        'start': 'go run cmd/main.go',
        'start:mcp': 'go run cmd/mcp-server/main.go',
        'test': 'go test ./...',
        'build': 'go build -o bin/server cmd/main.go'
      }
    };
    
    return defaults[projectType] || {};
  }

  /**
   * 更新 package.json 腳本
   */
  updatePackageJsonScripts() {
    const packageJsonPath = path.join(this.frameworkPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // 添加框架管理腳本
      packageJson.scripts = {
        ...packageJson.scripts,
        'start:framework': 'node src/mcp-server-universal.js',
        'setup': 'node setup.js',
        'setup:framework': 'node setup.js framework'
      };
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ 更新 package.json 腳本');
    }
  }

  // ========== 文件生成器 ==========

  generateNodePackageJson(projectName, projectType) {
    return JSON.stringify({
      name: projectName,
      version: '1.0.0',
      description: `${projectName} - Node.js API 專案`,
      type: 'commonjs',
      main: 'src/index.js',
      scripts: {
        start: 'node src/index.js',
        'start:mcp': 'node src/mcp-server.js',
        dev: 'node --watch src/index.js',
        test: 'node --test tests/',
        lint: 'eslint src/ tests/',
        format: 'prettier --write src/ tests/'
      },
      keywords: ['api', 'node', 'express', 'mcp'],
      author: 'Universal Project Manager',
      license: 'MIT',
      dependencies: {
        '@modelcontextprotocol/sdk': '^1.17.3',
        express: '^4.18.2',
        uuid: '^9.0.1',
        zod: '^3.22.4'
      },
      devDependencies: {
        eslint: '^8.56.0',
        prettier: '^3.1.1'
      }
    }, null, 2);
  }

  generateNodeIndex(projectName) {
    return `/**
 * ${projectName} - Main Server
 * Generated by Universal Project Manager
 */

const express = require('express');
const config = require('./config');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    name: '${projectName}',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Start server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 \${config.project.name} running on port \${PORT}\`);
});

module.exports = app;
`;
  }

  generateNodeConfig(projectName) {
    return `/**
 * ${projectName} Configuration
 * Generated by Universal Project Manager
 */

const config = {
  project: {
    name: '${projectName}',
    version: '1.0.0'
  },
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development'
};

module.exports = config;
`;
  }

  generateNodeMCPServer(projectName) {
    return `#!/usr/bin/env node

/**
 * ${projectName} MCP Server
 * Generated by Universal Project Manager
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

const server = new Server({
  name: '${projectName.toLowerCase()}-mcp',
  version: '1.0.0'
}, {
  capabilities: { tools: {} }
});

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_status',
      description: 'Get project status',
      inputSchema: { type: 'object', properties: {} }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;
  
  switch (name) {
    case 'get_status':
      return {
        content: [{
          type: 'text',
          text: \`📊 \${projectName} Status: Running ✅\`
        }]
      };
    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
});

// Start server
async function start() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 ${projectName} MCP Server started');
}

if (require.main === module) {
  start().catch(console.error);
}

module.exports = { server, start };
`;
  }

  generateReactPackageJson(projectName) {
    return JSON.stringify({
      name: projectName,
      version: '1.0.0',
      description: `${projectName} - React 前端專案`,
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-scripts': '^5.0.1'
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject'
      },
      browserslist: {
        production: ['>0.2%', 'not dead', 'not op_mini all'],
        development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
      }
    }, null, 2);
  }

  generateReactIndex(projectName) {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`;
  }

  generateReactApp(projectName) {
    return `import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header>
        <h1>${projectName}</h1>
        <p>Created with Universal Project Manager</p>
      </header>
      <main>
        <h2>Welcome to your React application!</h2>
        <p>This project was generated using the Universal Project Manager framework.</p>
      </main>
    </div>
  );
}

export default App;
`;
  }

  generateReactHTML(projectName) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectName}</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
`;
  }

  generatePythonRequirements() {
    return `fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
pytest==7.4.3
`;
  }

  generatePythonMain(projectName) {
    return `"""
${projectName} - Main Application
Generated by Universal Project Manager
"""

from fastapi import FastAPI
import uvicorn

app = FastAPI(title="${projectName}", version="1.0.0")

@app.get("/")
async def root():
    return {
        "name": "${projectName}",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
`;
  }

  generatePythonMCPServer(projectName) {
    return `#!/usr/bin/env python3
"""
${projectName} MCP Server
Generated by Universal Project Manager
"""

import asyncio
import json
from mcp.server import Server
from mcp.server.stdio import stdio_server

app = Server("${projectName.toLowerCase()}-mcp")

@app.list_tools()
async def list_tools():
    return [
        {
            "name": "get_status",
            "description": "Get project status",
            "inputSchema": {"type": "object", "properties": {}}
        }
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_status":
        return {
            "content": [{
                "type": "text",
                "text": f"📊 ${projectName} Status: Running ✅"
            }]
        }
    raise ValueError(f"Unknown tool: {name}")

if __name__ == "__main__":
    asyncio.run(stdio_server(app))
`;
  }

  generateGoMod(projectName) {
    return `module ${projectName}

go 1.21

require (
    github.com/gorilla/mux v1.8.0
    github.com/joho/godotenv v1.4.0
)
`;
  }

  generateGoMain(projectName) {
    return `package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"

    "github.com/gorilla/mux"
    "github.com/joho/godotenv"
)

type StatusResponse struct {
    Name      string    \`json:"name"\`
    Version   string    \`json:"version"\`
    Status    string    \`json:"status"\`
    Timestamp time.Time \`json:"timestamp"\`
}

type HealthResponse struct {
    Status string \`json:"status"\`
}

func main() {
    // Load .env file
    godotenv.Load()

    r := mux.NewRouter()
    
    r.HandleFunc("/", homeHandler).Methods("GET")
    r.HandleFunc("/health", healthHandler).Methods("GET")

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    fmt.Printf("🚀 ${projectName} running on port %s\\n", port)
    log.Fatal(http.ListenAndServe(":"+port, r))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    response := StatusResponse{
        Name:      "${projectName}",
        Version:   "1.0.0",
        Status:    "running",
        Timestamp: time.Now(),
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    response := HealthResponse{Status: "healthy"}
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
`;
  }

  generateGoConfig() {
    return `package config

import (
    "os"
    "strconv"
)

type Config struct {
    Port string
    Env  string
}

func Load() *Config {
    return &Config{
        Port: getEnv("PORT", "8080"),
        Env:  getEnv("ENV", "development"),
    }
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}
`;
  }

  generateGoMCPServer(projectName) {
    return `package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type Tool struct {
    Name        string      \`json:"name"\`
    Description string      \`json:"description"\`
    InputSchema interface{} \`json:"inputSchema"\`
}

type Response struct {
    Content []Content \`json:"content"\`
}

type Content struct {
    Type string \`json:"type"\`
    Text string \`json:"text"\`
}

func main() {
    // Simple MCP server for ${projectName}
    
    tools := []Tool{
        {
            Name:        "get_status",
            Description: "Get project status",
            InputSchema: map[string]interface{}{"type": "object", "properties": map[string]interface{}{}},
        },
    }

    // Output tools list
    toolsJSON, _ := json.Marshal(map[string]interface{}{"tools": tools})
    fmt.Println(string(toolsJSON))

    // Handle tool calls (simplified)
    response := Response{
        Content: []Content{
            {
                Type: "text",
                Text: "📊 ${projectName} Status: Running ✅",
            },
        },
    }
    
    responseJSON, _ := json.Marshal(response)
    fmt.Println(string(responseJSON))
}
`;
  }

  generateEnvExample() {
    return `# Environment Variables
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/app.db
LOG_LEVEL=info

# MCP Configuration
MCP_ENABLED=true

# Add your environment variables here
`;
  }

  generateGitignore() {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`;
  }

  generatePythonGitignore() {
    return `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
.coverage
.pytest_cache/
htmlcov/

# OS
.DS_Store
Thumbs.db
`;
  }

  generateGoGitignore() {
    return `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib
bin/

# Test binary, built with \`go test -c\`
*.test

# Output of the go coverage tool
*.out

# Dependency directories
vendor/

# Go workspace file
go.work

# IDE
.vscode/
.idea/
*.swp
*.swo

# Environment variables
.env

# OS
.DS_Store
Thumbs.db
`;
  }

  generateReadme(projectName, projectType) {
    return `# ${projectName}

${this.templates[projectType]?.description || projectType} 專案，使用 Universal Project Manager 創建。

## 功能特色

- ✅ 基於 Universal Project Manager 框架
- 🤖 支援 MCP (Model Context Protocol) 整合
- 🏗️ 模組化架構設計
- 🧪 內建測試框架
- 📚 完整文檔和範例

## 快速開始

### 安裝依賴
\`\`\`bash
${projectType === 'node-api' ? 'npm install' : 
  projectType === 'python-api' ? 'pip install -r requirements.txt' : 
  projectType === 'go-api' ? 'go mod download' : 
  'npm install'}
\`\`\`

### 啟動應用程式
\`\`\`bash
${projectType === 'node-api' ? 'npm start' : 
  projectType === 'react-app' ? 'npm start' :
  projectType === 'python-api' ? 'python app/main.py' : 
  projectType === 'go-api' ? 'go run cmd/main.go' : 
  'npm start'}
\`\`\`

### 啟動 MCP 伺服器 (如果支援)
\`\`\`bash
${projectType === 'node-api' ? 'npm run start:mcp' : 
  projectType === 'python-api' ? 'python mcp_server.py' : 
  projectType === 'go-api' ? 'go run cmd/mcp-server/main.go' : 
  '# MCP 不支援此專案類型'}
\`\`\`

## 專案結構

\`\`\`
${projectName}/
${this.templates[projectType]?.directories.map(dir => `├── ${dir}/`).join('\n') || '├── src/'}
├── README.md
└── package.json
\`\`\`

## 開發工作流程

1. **功能開發**: 在相應目錄中實作功能
2. **測試**: 運行 \`npm test\` 或對應的測試命令  
3. **MCP 整合**: 使用 Claude Code 的 MCP 功能管理專案

## Universal Project Manager 整合

此專案由 [Universal Project Manager](https://github.com/your-org/universal-project-manager) 創建和管理。

### 可用的 MCP 工具:
- \`get_framework_status\` - 檢查框架狀態
- \`list_projects\` - 列出所有專案
- \`switch_project\` - 切換專案
${projectType !== 'react-app' ? '- 專案特定的 MCP 工具' : ''}

### 切換到此專案:
\`\`\`bash
# 在 Claude Code 中使用
mcp__universal-project-manager__switch_project(projectName="${projectName}")
\`\`\`

## 貢獻

1. Fork 此專案
2. 創建 feature 分支 (\`git checkout -b feature/amazing-feature\`)
3. 提交變更 (\`git commit -m 'Add some amazing feature'\`)
4. 推送到分支 (\`git push origin feature/amazing-feature\`)
5. 開啟 Pull Request

## 授權

此專案使用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解詳情。

---

*由 Universal Project Manager v2.0.0 生成*
`;
  }
}

// 主程序
if (require.main === module) {
  const setup = new UniversalSetup();
  const args = process.argv.slice(2);
  
  setup.setup(args).catch(error => {
    console.error('❌ 設置失敗:', error.message);
    process.exit(1);
  });
}

module.exports = UniversalSetup;