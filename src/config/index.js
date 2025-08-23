/**
 * Universal Project Configuration Management
 * 通用專案配置管理 - 整合專案管理器和環境變數
 */

const ProjectManager = require('./projectManager');

// 初始化專案管理器
const projectManager = new ProjectManager();

/**
 * 獲取動態配置
 * 優先順序：環境變數 > 專案配置 > 預設值
 */
function getConfig() {
  const project = projectManager.getCurrentProject();
  const apiConfig = projectManager.getAPIConfig();
  const dbConfig = projectManager.getDatabaseConfig();
  const mcpConfig = projectManager.getMCPConfig();
  const globalSettings = projectManager.getGlobalSettings();

  return {
    // 專案資訊
    project: {
      name: project?.name || 'Universal Project',
      type: project?.type || 'generic',
      version: project?.config?.api?.version || apiConfig?.version || '1.0.0'
    },

    // 伺服器配置
    port: process.env.PORT || apiConfig?.port || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // 資料庫配置
    database: {
      type: dbConfig?.type || 'sqlite',
      path: process.env.DATABASE_PATH || dbConfig?.path || './data/tasks.db',
      verbose: process.env.DATABASE_VERBOSE === 'true' || dbConfig?.verbose || false
    },
    
    // API 配置
    api: {
      version: apiConfig?.version || '1.0.0',
      basePath: apiConfig?.basePath || '/api',
      maxRequestSize: apiConfig?.maxRequestSize || '10mb',
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: apiConfig?.rateLimit?.max || 100
      }
    },
    
    // 日誌配置
    logging: {
      level: process.env.LOG_LEVEL || globalSettings?.logging?.level || 'info',
      format: process.env.LOG_FORMAT || globalSettings?.logging?.format || 'json'
    },
    
    // CORS 配置
    cors: {
      origin: process.env.CORS_ORIGIN || apiConfig?.cors?.origin || '*',
      credentials: apiConfig?.cors?.credentials ?? true
    },
    
    // MCP Server 配置
    mcp: {
      enabled: process.env.MCP_ENABLED !== 'false' && (mcpConfig?.enabled ?? globalSettings?.enableMCP ?? true),
      stdio: process.env.MCP_STDIO === 'true',
      serverName: mcpConfig?.serverName || 'universal-server',
      tools: mcpConfig?.tools || []
    },
    
    // 功能開關
    features: project?.features || {},
    
    // 腳本配置
    scripts: project?.scripts || {},
    
    // 開發環境設定
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    
    // 專案管理器實例
    projectManager
  };
}

// 導出動態配置
const config = getConfig();

// 添加輔助方法
config.reload = () => {
  projectManager.loadConfig();
  Object.assign(config, getConfig());
  return config;
};

config.getProjectManager = () => projectManager;

config.switchProject = (projectName) => {
  projectManager.setDefaultProject(projectName);
  return config.reload();
};

config.hasFeature = (featureName) => {
  return projectManager.hasFeature(featureName);
};

config.getFrameworkStatus = () => {
  return projectManager.getFrameworkStatus();
};

module.exports = config;