import type { ApiResponse, WebhookLog, WebhookStats } from '../types';
import { MOCK_WEBHOOK_LOGS, MOCK_WEBHOOK_STATS } from '../mock/webhooks';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取 Webhook 日志列表
 */
export const getWebhookLogs = async (): Promise<ApiResponse<WebhookLog[]>> => {
  await sleep(600);
  return { code: 200, data: MOCK_WEBHOOK_LOGS, message: 'success' };
};

/**
 * 获取 Webhook 统计指标
 */
export const getWebhookStats = async (): Promise<ApiResponse<WebhookStats>> => {
  await sleep(400);
  return { code: 200, data: MOCK_WEBHOOK_STATS, message: 'success' };
};
