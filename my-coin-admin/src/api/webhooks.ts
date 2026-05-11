import { request } from '@/utils/request';
import type { ApiResponse, WebhookLog, WebhookStats } from '@/types';

export const getWebhookLogs = (): Promise<ApiResponse<WebhookLog[]>> => {
  return request({ url: '/webhooks/logs', method: 'GET' });
};

export const getWebhookStats = (): Promise<ApiResponse<WebhookStats>> => {
  return request({ url: '/webhooks/stats', method: 'GET' });
};
