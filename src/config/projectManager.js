/**
 * Universal Project Manager Configuration
 * 通用專案管理器 - 支援多種專案類型的配置管理
 */

const fs = require('fs');
const path = require('path');

class ProjectManager {
  constructor(configPath = null) {
    this.configPath = configPath || path.join(process.cwd(), 'config', 'projects.json');
    this.config = null;
    this.currentProject = null;
    this.loadConfig();
  }

  /**
   * 載入專案配置
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(configData);
        
        // 設定當前專案
        const projectName = process.env.PROJECT_NAME || this.config.defaultProject;
        if (projectName && this.config.projects[projectName]) {
          this.currentProject = this.config.projects[projectName];
        }
      } else {
        throw new Error(`配置文件不存在: ${this.configPath}`);
      }
    } catch (error) {
      console.error('載入配置失敗:', error.message);
      this.config = this.getDefaultConfig();
    }
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      framework: {
        name: "Universal Project Manager",
        version: "2.0.0",
        type: "universal-framework"
      },
      defaultProject: "default",
      projects: {},
      globalSettings: {
        autoSetup: true,
        enableMCP: true
      }
    };
  }

  /**
   * 獲取當前專案配置
   */
  getCurrentProject() {
    return this.currentProject;
  }

  /**
   * 獲取專案配置
   */
  getProject(projectName) {
    return this.config?.projects[projectName];
  }

  /**
   * 獲取所有專案
   */
  getAllProjects() {
    return this.config?.projects || {};
  }

  /**
   * 添加新專案
   */
  addProject(projectName, projectConfig) {
    if (!this.config.projects) {
      this.config.projects = {};
    }
    
    this.config.projects[projectName] = {
      name: projectConfig.name || projectName,
      type: projectConfig.type || 'generic',
      description: projectConfig.description || '',
      rootPath: projectConfig.rootPath || process.cwd(),
      config: projectConfig.config || {},
      features: projectConfig.features || {},
      scripts: projectConfig.scripts || {},
      ...projectConfig
    };
    
    this.saveConfig();
    return this.config.projects[projectName];
  }

  /**
   * 更新專案配置
   */
  updateProject(projectName, updates) {
    if (this.config.projects[projectName]) {
      this.config.projects[projectName] = {
        ...this.config.projects[projectName],
        ...updates
      };
      this.saveConfig();
      return this.config.projects[projectName];
    }
    throw new Error(`專案不存在: ${projectName}`);
  }

  /**
   * 刪除專案
   */
  removeProject(projectName) {
    if (this.config.projects[projectName]) {
      delete this.config.projects[projectName];
      this.saveConfig();
      return true;
    }
    return false;
  }

  /**
   * 設定預設專案
   */
  setDefaultProject(projectName) {
    if (this.config.projects[projectName]) {
      this.config.defaultProject = projectName;
      this.currentProject = this.config.projects[projectName];
      this.saveConfig();
      return true;
    }
    throw new Error(`專案不存在: ${projectName}`);
  }

  /**
   * 獲取專案模板
   */
  getTemplate(templateName) {
    return this.config?.templates?.[templateName] || this.getBuiltInTemplate(templateName);
  }

  /**
   * 獲取內建模板
   */
  getBuiltInTemplate(templateName) {
    const builtInTemplates = {
      'node-api': {
        description: 'Node.js API 專案模板',
        features: { mcp: { enabled: true } }
      },
      'react-app': {
        description: 'React 前端專案模板',
        features: { mcp: { enabled: false } }
      },
      'python-api': {
        description: 'Python API 專案模板',
        features: { mcp: { enabled: true } }
      },
      'go-api': {
        description: 'Go API 專案模板',
        features: { mcp: { enabled: true } }
      }
    };
    return builtInTemplates[templateName];
  }

  /**
   * 獲取所有模板
   */
  getAllTemplates() {
    return this.config?.templates || {};
  }

  /**
   * 根據專案類型獲取配置
   */
  getConfigForType(projectType) {
    const project = this.getCurrentProject();
    if (!project) return null;

    const template = this.getTemplate(project.type);
    const mergedConfig = {
      ...template?.features,
      ...project.config,
      ...project.features
    };

    return mergedConfig;
  }

  /**
   * 檢查專案是否支援功能
   */
  hasFeature(featureName) {
    const project = this.getCurrentProject();
    return project?.features?.[featureName] === true;
  }

  /**
   * 獲取 MCP 配置
   */
  getMCPConfig() {
    const project = this.getCurrentProject();
    if (!project?.config?.mcp?.enabled) {
      return null;
    }

    return {
      serverName: project.config.mcp.serverName || 'generic-server',
      tools: project.config.mcp.tools || [],
      enabled: true,
      ...project.config.mcp
    };
  }

  /**
   * 獲取資料庫配置
   */
  getDatabaseConfig() {
    const project = this.getCurrentProject();
    return project?.config?.database || this.config?.globalSettings?.defaultDatabase || null;
  }

  /**
   * 獲取 API 配置
   */
  getAPIConfig() {
    const project = this.getCurrentProject();
    return project?.config?.api || {};
  }

  /**
   * 獲取腳本配置
   */
  getScripts() {
    const project = this.getCurrentProject();
    return project?.scripts || {};
  }

  /**
   * 獲取全域設定
   */
  getGlobalSettings() {
    return this.config?.globalSettings || {};
  }

  /**
   * 更新全域設定
   */
  updateGlobalSettings(updates) {
    this.config.globalSettings = {
      ...this.config.globalSettings,
      ...updates
    };
    this.saveConfig();
  }

  /**
   * 儲存配置到檔案
   */
  saveConfig() {
    try {
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
    } catch (error) {
      console.error('儲存配置失敗:', error.message);
    }
  }

  /**
   * 驗證專案配置
   */
  validateProject(projectName) {
    const project = this.getProject(projectName);
    if (!project) {
      return { valid: false, errors: [`專案不存在: ${projectName}`] };
    }

    const errors = [];
    
    // 檢查必需欄位
    if (!project.name) errors.push('專案名稱不能為空');
    if (!project.type) errors.push('專案類型不能為空');
    if (!project.rootPath) errors.push('專案路徑不能為空');

    // 檢查路徑是否存在
    if (project.rootPath && !fs.existsSync(project.rootPath)) {
      errors.push(`專案路徑不存在: ${project.rootPath}`);
    }

    // 檢查模板
    const template = this.getTemplate(project.type);
    if (template) {
      // 檢查必需檔案
      if (template.requiredFiles) {
        for (const file of template.requiredFiles) {
          const filePath = path.join(project.rootPath, file);
          if (!fs.existsSync(filePath)) {
            errors.push(`缺少必需檔案: ${file}`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 檢查框架狀態
   */
  getFrameworkStatus() {
    const projects = this.getAllProjects();
    const projectCount = Object.keys(projects).length;
    const activeProjects = Object.values(projects).filter(p => p.active !== false).length;
    
    return {
      framework: this.config?.framework || {},
      projectCount,
      activeProjects,
      currentProject: this.currentProject?.name || null,
      mcpEnabled: this.config?.mcpIntegration?.enabled || false,
      globalSettings: this.getGlobalSettings()
    };
  }
}

module.exports = ProjectManager;