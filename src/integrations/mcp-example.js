/**
 * MCP Integration Example
 * 展示如何在應用中整合 MCP 服務器
 */

export class MCPIntegration {
  constructor() {
    this.integrations = new Map();
  }

  /**
   * 註冊 MCP 整合
   */
  register(name, handler) {
    this.integrations.set(name, handler);
    console.log(`✅ MCP integration registered: ${name}`);
  }

  /**
   * GitHub Issues 整合範例
   * 當任務建立時，自動創建 GitHub Issue
   */
  async createGitHubIssue(task) {
    if (!this.integrations.has('github')) {
      console.log('GitHub integration not available');
      return;
    }

    const githubHandler = this.integrations.get('github');
    return await githubHandler({
      action: 'create_issue',
      title: task.title,
      body: task.description,
      labels: task.tags,
      assignee: task.assignee,
    });
  }

  /**
   * Slack 通知整合範例
   * 當任務狀態更新時發送 Slack 通知
   */
  async sendSlackNotification(task, previousStatus) {
    if (!this.integrations.has('slack')) {
      console.log('Slack integration not available');
      return;
    }

    const slackHandler = this.integrations.get('slack');
    const message = {
      text: `Task "${task.title}" status changed`,
      attachments: [
        {
          color: task.status === 'completed' ? 'good' : 'warning',
          fields: [
            { title: 'Previous Status', value: previousStatus, short: true },
            { title: 'New Status', value: task.status, short: true },
            { title: 'Assignee', value: task.assignee || 'Unassigned', short: true },
            { title: 'Priority', value: task.priority, short: true },
          ],
        },
      ],
    };

    return await slackHandler({
      action: 'send_message',
      channel: '#task-updates',
      message,
    });
  }

  /**
   * 資料庫持久化整合範例
   * 使用 SQLite MCP 服務器儲存任務
   */
  async persistToDatabase(task) {
    if (!this.integrations.has('database')) {
      console.log('Database integration not available');
      return;
    }

    const dbHandler = this.integrations.get('database');
    return await dbHandler({
      action: 'upsert',
      table: 'tasks',
      data: task.toJSON(),
    });
  }

  /**
   * 批次同步範例
   * 從外部來源同步任務
   */
  async syncFromExternal(source) {
    const handler = this.integrations.get(source);
    if (!handler) {
      throw new Error(`Integration ${source} not found`);
    }

    const externalTasks = await handler({
      action: 'fetch_tasks',
      filters: { updated_after: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    return externalTasks;
  }
}

export const mcpIntegration = new MCPIntegration();

/**
 * 使用範例：
 * 
 * import { mcpIntegration } from './integrations/mcp-example.js';
 * 
 * // 在任務創建時
 * const task = taskService.createTask(data);
 * await mcpIntegration.createGitHubIssue(task);
 * await mcpIntegration.persistToDatabase(task);
 * 
 * // 在任務更新時
 * const previousStatus = task.status;
 * taskService.updateTask(id, updates);
 * await mcpIntegration.sendSlackNotification(task, previousStatus);
 */